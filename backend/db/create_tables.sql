CREATE TABLE options (
  contract_name       VARCHAR(32) PRIMARY KEY,
  underlying_asset    VARCHAR(10) NOT NULL,
  option_type         VARCHAR(4) NOT NULL,      -- e.g. "call", "put"
  strike              BIGINT NOT NULL,
  expiry              BIGINT NOT NULL,
  last_trade_date     BIGINT NOT NULL,
  last_price          BIGINT NOT NULL,
  bid                 BIGINT NOT NULL,
  ask                 BIGINT NOT NULL,
  percent_change      INTEGER NOT NULL,
  volume              BIGINT NOT NULL,
  open_interest       BIGINT NOT NULL,
  implied_volatility  BIGINT NOT NULL,
  in_the_money        BOOLEAN NOT NULL,
  creator             TEXT NOT NULL,            -- maps Clarity principal to TEXT
  is_active           BOOLEAN NOT NULL
);

CREATE TABLE positions (
  owner            TEXT NOT NULL,
  contract_name    VARCHAR(32) NOT NULL,
  option_type      VARCHAR(4) NOT NULL,
  expiry           BIGINT NOT NULL,
  price_entered    BIGINT NOT NULL,
  market_price     BIGINT NOT NULL,
  quantity         BIGINT NOT NULL,
  date_entered     BIGINT NOT NULL,
  is_open          BOOLEAN NOT NULL,
  PRIMARY KEY (owner, contract_name)
);

CREATE TABLE transactions (
  tx_id           BIGINT PRIMARY KEY,
  principal       TEXT NOT NULL,
  action          VARCHAR(4) NOT NULL,         -- e.g. "buy" / "sell"
  contract_name   VARCHAR(32) NOT NULL,
  quantity        BIGINT NOT NULL,
  price           BIGINT NOT NULL,
  timestamp       BIGINT NOT NULL
);