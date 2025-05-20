
import Link from "next/link"
import { LucideIcon, ArrowRight } from "lucide-react"
import React from "react"

interface CardProps {
    icon: LucideIcon
    title: string
    href: string
    description: string
}

export default function NavCard({ icon: Icon, title, href, description }: CardProps) {
    return (
        <Link href={href}
            className="
          group
          block
          rounded-xl
          border
          border-gray-700
          bg-gradient-to-br
          from-gray-900
          via-gray-800
          to-gray-900
          shadow-md
          hover:shadow-lg
          transition-shadow
          duration-300
          p-6
          relative
          overflow-hidden
         max-w-2xl
        "
            aria-label={title}
        >
            <div className="flex items-center space-x-4">
                <div className="text-white group-hover:text-green-400 transition-colors duration-100 ease-in-out">
                    <Icon size={32} />
                </div>
                <h3 className="text-white text-xl font-semibold">{title}</h3>
            </div>
            <p className="mt-3 text-gray-300 text-sm">{description}</p>

            {/* Bottom-left arrow with micro animation */}
            <div
                className="
            absolute
            bottom-4
            right-4
            text-white
            group-hover:translate-x-1
            transition-transform
            duration-300
            ease-in-out
            "
                aria-hidden="true"
            >
                <ArrowRight size={24} />
            </div>

        </Link>
    )
}
