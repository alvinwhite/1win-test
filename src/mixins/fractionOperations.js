export default {
    name: 'fractionOperations',
    methods: {
        /** 
         * Calculates and returns greatest common divisor
         * 
         * @param {number} a
         * @param {number} b
         * @return {number}
        */
        gcd(a, b) {
            return !b ? a : this.gcd(b, a % b)
        },
        /** 
         * Calculates and returns least common multiplier
         * 
         * @param {number} a
         * @param {number} b
         * @return {number}
        */
        lcm(a, b) {
            return a * (b / this.gcd(a,b))
        },
        /** 
         * Given set of denominators, returns the least common denominator
         * 
         * @param {array} denominators
         * @return {number}
        */
        getLCD(denominators) {
            return denominators.reduce(this.lcm)
        },
        reduceFraction(fraction) {
            const gcd = this.gcd(fraction.numerator, fraction.denominator)
            return {
                ...fraction, 
                numerator: fraction.numerator / gcd,
                denominator: fraction.denominator / gcd 
            }
        },
        /** 
         * Calculates and returns numerator multiplier, given fraction and lesat common denominator
         * 
         * @param {object} fraction
         * @param {number} lcd
         * @return {number}
        */
        getNumeratorMultiplier(fraction, lcd) {
            return lcd / fraction.denominator
        },
        /**
         * Checks if a fraction is negative
         * @param {object} fraction
         * @return {boolean}
         */
        isFractionNegative(fraction) {
            return (fraction.numerator < 0 && fraction.denominator > 0) || (fraction.numerator > 0 && fraction.denominator < 0)
        },
        fractionSum(a,b) {
            const lcd = a.denominator === b.denominator ? a.denominator : this.getLCD([a.denominator,b.denominator])

            const numerator = 
                    this.getNumeratorMultiplier(a, lcd) * a.numerator
                    + this.getNumeratorMultiplier(b, lcd) * b.numerator 

            return {
                numerator,
                denominator: lcd
            }
        },
        fractionSubstraction(a,b) {
            const lcd = a.denominator === b.denominator ? a.denominator : this.getLCD([a.denominator,b.denominator])
            const numerator = 
                    this.getNumeratorMultiplier(b, lcd) * a.numerator 
                    - this.getNumeratorMultiplier(a, lcd) * b.numerator

            return {
                numerator,
                denominator: lcd
            }
        },
        areValidMultiplyArgs(a,b) {
            return a.denominator * b.denominator === 0 ? false : true 
        },
        fractionMultiply(a,b) {
            return {
                numerator: a.numerator * b.numerator,
                denominator: a.denominator * b.denominator
            }
        },
        areValidDevisionArgs(a,b) {
            return a.denominator * b.numerator === 0 ? false : true 
        },
        fractionDivide(a,b) {
            return {
                numerator: a.numerator * b.denominator,
                denominator: a.denominator * b.numerator
            }
        }
    }
}