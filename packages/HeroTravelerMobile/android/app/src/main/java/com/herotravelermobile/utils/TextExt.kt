package com.herotravelermobile.utils

operator fun Appendable.plusAssign(csq: CharSequence) {
    append(csq)
}

operator fun Appendable.plusAssign(c: Char) {
    append(c)
}