<template>
    <div class="calculator">
        <div class="calculator__grid grid">
            <div class="calculator__fractions-row row row--align_center">
                <div v-for="fraction in fractionsArray" :key="fraction.id" class="calculator__col row__col row__col--auto">
                    <Fraction
                        :id="fraction.id"
                        :denominator="fraction.denominator"
                        :numerator="fraction.numerator"
                        :operation="fraction.operation"
                        :negative="fraction.negative"
                        :validation="fraction.validation"
                        @input="handleFractionInput"
                        class="calculator__fraction"
                    />
                </div>
                <div :key="'result'" class="calculator__col row__col row__col--auto">
                    <Fraction 
                        :id="'result'"
                        :denominator="result.denominator"
                        :numerator="result.numerator"
                        :negative="isNegative(result)"
                        :operation="'='"
                        :editable="false"
                        class="calculator__fraction"
                    />
                </div>
            </div>
            <div class="calculator__actions-row">
                <button @click="addFraction()" class="calculator__button">
                    ADD FRACTION
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Fraction from './Fraction.vue'
import nanoid from 'nanoid'
import numericOperations from '@/mixins/numericOperations'

export default {
    components: { Fraction },
    mixins: [numericOperations],
    data() {
        return {
            fractions: {
                '0': {
                    id: '0', 
                    denominator: 2,
                    numerator: 1,
                    operation: null,
                    order: 1,
                },
                '1': {
                    id: '1', 
                    denominator: 3,
                    numerator: 1,
                    operation: '+',
                    order: 0,
                }
            },
            operationDfeault: '+',
            operationTypes: {
                '+': {
                    presedence: 1,
                    calculate: (a,b) => {
                        const lcd = a.denominator === b.denominator ? a.denominator : this.getLCD([a.denominator,b.denominator])
                        const numerator = 
                              this.getNumeratorMultiplier(a, lcd) * a.numerator
                              + this.getNumeratorMultiplier(b, lcd) * b.numerator 

                        return {
                            numerator,
                            denominator: lcd
                        }
                    }
                },
                '-': {
                    presedence: 1,
                    calculate: (a,b) => {
                        const lcd = a.denominator === b.denominator ? a.denominator : this.getLCD([a.denominator,b.denominator])
                        const numerator = 
                              this.getNumeratorMultiplier(b, lcd) * a.numerator 
                              - this.getNumeratorMultiplier(a, lcd) * b.numerator

                        return {
                            numerator,
                            denominator: lcd
                        }
                    }
                }, 
                '*': {
                    presedence: 2,
                    isValid: (a,b) => {
                        return a.denominator * b.denominator === 0 ? false : true 
                    },
                    calculate: (a,b) => {
                        return {
                            numerator: a.numerator * b.numerator,
                            denominator: a.denominator * b.denominator
                        }
                    }
                },
                '/': {
                    presedence: 2,
                    isValid: (a,b) => {
                        return a.denominator * b.numerator === 0 ? false : true 
                    },
                    calculate: (a,b) => {
                        return {
                            numerator: a.numerator * b.denominator,
                            denominator: a.denominator * b.numerator
                        }
                    }
                },
                ':': {
                    presedence: 2,
                    isValid: (a,b) => {
                        return a.denominator * b.numerator === 0 ? false : true 
                    },
                    calculate: (a,b) => {
                        return {
                            numerator: a.numerator * b.denominator,
                            denominator: a.denominator * b.numerator
                        }
                    }
                }
            }
        }
    },
    methods: {
        handleFractionInput(fraction) {
            const validations = this.validateFraction(fraction)
            if(validations.numerator) {
                fraction.numerator = Number(fraction.numerator)
            }
            if(validations.denominator) {
                fraction.denominator = Number(fraction.denominator)
            }
            // No need to check for validation, because string < number is false anyway
            if(fraction.numerator < 0 && fraction.denominator < 0) {
                fraction.numerator = Math.abs(fraction.numerator)
                fraction.denominator = Math.abs(fraction.denominator)
            }

            this.$set(this.fractions, fraction.id, {...this.fractions[fraction.id], ...fraction})
        },
        /**
         * Returns object with the result of validation of a fraction
         * 
         * @param {object} fraction
         * @return {object}
         */
        validateFraction(fraction) {
            const validations = {
                numerator: this.isNumeric(fraction.numerator),
                denominator: this.isNumeric(fraction.denominator) && Number(fraction.denominator) !== 0,
                operation: typeof fraction.operation === 'string' && Object.keys(this.operationTypes).includes(fraction.operation)
            }

            return {
                valid: validations.numerator && validations.denominator,
                validations
            }
        },
        /**
         * Checks if a fraction is negative
         * @param {object} fraction
         * @return {boolean}
         */
        isNegative(fraction) {
            return (fraction.numerator < 0 && fraction.denominator > 0) || (fraction.numerator > 0 && fraction.denominator < 0)
        },
        reduce(fraction) {
            const gcd = this.gcd(fraction.numerator, fraction.denominator)
            return {
                ...fraction, 
                numerator: fraction.numerator / gcd,
                denominator: fraction.denominator / gcd 
            }
        },
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
         * Converts chain of tokens to the Reverse Polish Notation using Shunting-Yard Algorithm
         * 
         * @param {array} tokens
         * @return {array}
         */
        convertInfixToReversePolish(tokens) {
            const queue = []
            const stack = []

            while (tokens.length) {
                const token = tokens.shift()
                const tkPrec = token.presedence || 0
                let stPrec = stack.length ? stack[stack.length - 1].presedence : 0

                if (token.type == 'OP' && token.value == ')') {
                    let op = null

                    while ((op = stack.pop()).value != '(') {
                        queue.push(op)
                    }
                } else if (token.type == 'NUM') {
                    queue.push(token)
                } else if (token.type == 'OP' && (!stack.length || token.value == '(' || tkPrec > stPrec)) {
                    stack.push(token)
                } else {
                    while (tkPrec <= stPrec) {
                        queue.push(stack.pop())
                        stPrec = stack.length ? stack[stack.length - 1].presedence : 0
                    }

                    stack.push(token)
                }
            }

            while (stack.length) {
                queue.push(stack.pop())
            }

            return queue
        },
        addFraction() {
            const id = nanoid(5)
            this.fractions[this.fractionsArray[0].id].operation = this.operationDfeault

            this.$set(this.fractions, id, {
                id,
                numerator: 1,
                denominator: 2,
                operation: null,
                order: this.fractionsArray[0].order + 1,
            })
        }
    },
    computed: {
        /**
         * Provides our fractions with some computed properties 
         * and sorts it according to the fraction.order property as well
         */
        fractionsArray() {
            return Object
                .values(this.fractions)
                .map(fraction => ({
                    ...fraction,
                    negative: this.isNegative(fraction),
                    validation: this.validateFraction(fraction)
                }))
                .sort((a,b) => b.order - a.order)
        },
        tokens() {
            let tokens = []

            for (let i = 0; i < this.fractionsArray.length; i++) {
                const operationType = this.fractionsArray[i].operation

                // operation is given and type exists 
                if(operationType && this.operationTypes[operationType]) 
                    tokens.push({type: 'OP', value: operationType})

                tokens.push({type: 'NUM', ...this.fractionsArray[i]}) 
            }

            return this.convertInfixToReversePolish(tokens)
        },
        result() {
            const stack = []
            const tokens = [...this.tokens]

            while (tokens.length) {
                const token = tokens.shift()

                if (token.type == 'NUM') {
                    stack.push(token)
                    continue
                }

                const rhs = stack.pop()
                const lhs = stack.pop()
                
                const operation = this.operationTypes[token.value]
                const lhsValidity = lhs && this.validateFraction(lhs).valid
                const rhsValidity = rhs && this.validateFraction(rhs).valid
                let valid = lhsValidity && rhsValidity
                
                if (valid && operation.isValid) {
                    valid = operation.isValid(lhs, rhs)
                }

                if (valid) {
                    stack.push(operation.calculate(lhs, rhs))
                    continue
                } 

                if(lhsValidity) {
                    stack.push(lhs)
                }
                if(rhsValidity) {
                    stack.push(rhs) 
                }
            }
 
            const result = stack.pop()

            if(result && this.validateFraction(result).valid) {
                return this.reduce(result)
            }

            return {numerator: '??', denominator: '??'}
        }
    }
}
</script>

<style lang="stylus">
    .calculator__actions-row
        margin-top: 2rem;
</style>