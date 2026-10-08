"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import type { HTMLMotionProps } from "framer-motion";

export function FadeIn({
children,
delay = 0,
}: PropsWithChildren<{ delay?: number }>) {
return (
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.7,
delay,
ease: [0.22, 1, 0.36, 1],
}}
>
{children}
</motion.div>
);
}

export function Reveal({
children,
delay = 0,
}: PropsWithChildren<{ delay?: number }>) {
return (
<motion.div
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.15 }}
transition={{
duration: 0.65,
delay,
ease: [0.22, 1, 0.36, 1],
}}
>
{children}
</motion.div>
);
}

type MagneticLinkProps = PropsWithChildren<
Omit<HTMLMotionProps<"a">, "whileHover" | "transition">

> ;

export function MagneticLink({
children,
...props
}: MagneticLinkProps) {
return (
<motion.a
whileHover={{ y: -2 }}
transition={{ duration: 0.2 }}
{...props}
>
{children}
</motion.a>
);
}
