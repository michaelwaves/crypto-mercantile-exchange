;; title: hello-stacks
;; version:
;; summary:
;; description:

;; Error codes
(define-constant ERR-UNAUTHORIZED u401)
(define-constant ERR-INSUFFICIENT-BALANCE u402)
(define-constant ERR-NO-POSITION u403)
(define-constant ERR-NOT-FOUND u404)
(define-constant ERR-INACTIVE u410)

(define-map options
    { contract-name: (string-ascii 32) }
    {
        underlying-asset: (string-ascii 10),
        option-type: (string-ascii 4),
        strike: uint,
        expiry: uint,
        last-trade-date: uint,
        last-price: uint,
        bid: uint,
        ask: uint,
        percent-change: int,
        volume: uint,
        open-interest: uint,
        implied-volatility: uint,
        in-the-money: bool,
        creator: principal,
        is-active: bool,
    }
)

;; A user's individual position in a specific contract
(define-map positions
    {
        owner: principal,
        contract-name: (string-ascii 32),
    }
    {
        option-type: (string-ascii 4),
        expiry: uint,
        price-entered: uint,
        market-price: uint,
        quantity: uint,
        date-entered: uint,
        is-open: bool,
    }
)

;; Transactions log
(define-map transactions
    { tx-id: uint }
    {
        principal: principal,
        action: (string-ascii 4), ;; "buy" or "sell"
        contract-name: (string-ascii 32),
        quantity: uint,
        price: uint,
        timestamp: uint,
    }
)

;; Track number of transactions use as id for transactions, incrementing by 1 as a serial id
(define-data-var tx-counter uint u0)

;; Market Maker and contract owner, only this address can call create-option and delete-option
(define-constant contract-owner 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

;; Market Maker funds contract with some liquidity
(define-public (fund-contract (amount uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) (err ERR-UNAUTHORIZED))
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (ok true)
    )
)

(define-public (create-option
        (contract-name (string-ascii 32))
        (underlying-asset (string-ascii 10))
        (option-type (string-ascii 4))
        (strike uint)
        (expiry uint)
        (bid uint)
        (ask uint)
        (iv uint)
    )
    (begin
        (asserts! (is-eq tx-sender contract-owner) (err ERR-UNAUTHORIZED))
        (map-set options { contract-name: contract-name } {
            underlying-asset: underlying-asset,
            option-type: option-type,
            strike: strike,
            expiry: expiry,
            last-trade-date: stacks-block-height,
            last-price: u0,
            bid: bid,
            ask: ask,
            percent-change: 0,
            volume: u0,
            open-interest: u0,
            implied-volatility: iv,
            in-the-money: false,
            creator: tx-sender,
            is-active: true,
        })
        (ok true)
    )
)

(define-public (delete-option (contract-name (string-ascii 32)))
    (begin
        (asserts! (is-eq tx-sender contract-owner) (err ERR-UNAUTHORIZED))
        (let ((option (map-get? options { contract-name: contract-name })))
            (match option
                opt (begin
                    (map-set options { contract-name: contract-name }
                        (merge opt { is-active: false })
                    )
                    (ok true)
                )
                (err ERR-NOT-FOUND)
            )
        )
    )
)

;; below are buy and sell functions callable by anyone
(define-public (buy-option
        (contract-name (string-ascii 32))
        (quantity uint)
    )
    (let ((option (map-get? options { contract-name: contract-name })))
        (match option
            opt (begin
                (asserts! (get is-active opt) (err ERR-INACTIVE))
                ;; Safe multiplication using checked arithmetic
                (let (
                        (ask (get ask opt))
                        (total-cost (* ask quantity))
                    )
                    ;; Transfer STX to market maker
                    (try! (stx-transfer? total-cost tx-sender (get creator opt)))
                    ;; Update positions map
                    (let (
                            (pos-key {
                                owner: tx-sender,
                                contract-name: contract-name,
                            })
                            (existing (map-get? positions pos-key))
                        )
                        (match existing
                            ex (map-set positions pos-key
                                (merge ex {
                                    quantity: (+ (get quantity ex) quantity),
                                    market-price: ask,
                                })
                            )
                            (map-set positions pos-key {
                                option-type: (get option-type opt),
                                expiry: (get expiry opt),
                                price-entered: ask,
                                market-price: ask,
                                quantity: quantity,
                                date-entered: stacks-block-height,
                                is-open: true,
                            })
                        )
                    )
                    ;; Update option volume + open interest
                    (map-set options { contract-name: contract-name }
                        (merge opt {
                            volume: (+ (get volume opt) quantity),
                            open-interest: (+ (get open-interest opt) quantity),
                            last-price: ask,
                            last-trade-date: stacks-block-height,
                        })
                    )
                    ;; Log transaction
                    (let ((tx-id (+ (var-get tx-counter) u1)))
                        (map-set transactions { tx-id: tx-id } {
                            principal: tx-sender,
                            action: "buy",
                            contract-name: contract-name,
                            quantity: quantity,
                            price: ask,
                            timestamp: stacks-block-height,
                        })
                        (var-set tx-counter tx-id)
                    )
                    (ok true)
                )
            )
            (err ERR-NOT-FOUND)
        )
    )
)

(define-public (sell-option
        (contract-name (string-ascii 32))
        (quantity uint)
    )
    (let ((option (map-get? options { contract-name: contract-name })))
        (match option
            opt (begin
                (asserts! (get is-active opt) (err ERR-INACTIVE))
                (let (
                        (pos-key {
                            owner: tx-sender,
                            contract-name: contract-name,
                        })
                        (existing (map-get? positions pos-key))
                    )
                    (match existing
                        pos
                        (begin
                            (asserts! (>= (get quantity pos) quantity)
                                (err ERR-INSUFFICIENT-BALANCE)
                            )
                            (let (
                                    (bid (get bid opt))
                                    (creator (get creator opt))
                                    (payout (* bid quantity))
                                )
                                ;; Transfer STX to user                         
                                (let ((recipient tx-sender))
                                    (try! (as-contract (stx-transfer? payout tx-sender recipient)))
                                )
                                ;; Update position
                                (let ((remaining (- (get quantity pos) quantity)))
                                    (if (is-eq remaining u0)
                                        (map-delete positions pos-key)
                                        (map-set positions pos-key
                                            (merge pos {
                                                quantity: remaining,
                                                market-price: bid,
                                            })
                                        )
                                    )
                                )
                                ;; Update option stats
                                (map-set options { contract-name: contract-name }
                                    (merge opt {
                                        volume: (+ (get volume opt) quantity),
                                        open-interest: (- (get open-interest opt) quantity),
                                        last-price: bid,
                                        last-trade-date: stacks-block-height,
                                    })
                                )
                                ;; Log transaction
                                (let ((tx-id (+ (var-get tx-counter) u1)))
                                    (map-set transactions { tx-id: tx-id } {
                                        principal: tx-sender,
                                        action: "sell",
                                        contract-name: contract-name,
                                        quantity: quantity,
                                        price: bid,
                                        timestamp: stacks-block-height,
                                    })
                                    (var-set tx-counter tx-id)
                                )
                                (ok true)
                            )
                        )
                        (err ERR-NO-POSITION) ;; No open position
                    )
                )
            )
            (err ERR-NOT-FOUND)
        )
    )
)

(define-read-only (get-position
        (owner principal)
        (contract-name (string-ascii 32))
    )
    (map-get? positions {
        owner: owner,
        contract-name: contract-name,
    })
)
