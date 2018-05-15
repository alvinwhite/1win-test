<template>
    <div :class="{'fraction': true, 'fraction--negative': negative}">
        <div :class="{'fraction__sign': true, 'fraction__sign--invalid': validation && validation.validations.operation === false}">
            <input maxlength="1" v-if="editable && operation !== null" :value="operation" @input="handleInput({operation: $event.target.value})" class="fraction__input" />

            <span :class="{'fraction__input': true, 'fraction__input--disabled': !editable}">
                {{operation}}
            </span>
        </div>
        <div v-if="negative" class="fraction__sign fraction__sign--negative">
            <span>(-</span>
        </div>
        <div :class="{'fraction__number fraction__number--numerator': true, 'fraction__number--invalid': validation && validation.validations.numerator === false}">
            <input v-if="editable" :value="inputValueFormatter(numerator)" @input="handleInput({numerator: $event.target.value})" class="fraction__input" />
            
            <span v-if="editable && numerator < 0" @click="toggleSign({numerator})" class="fraction__subsign">
                
            </span>

            <span :class="{'fraction__input': true, 'fraction__input--disabled': !editable}">
                {{inputValueFormatter(numerator)}}
            </span>
        </div>
        <div :class="{'fraction__number fraction__number--denominator': true, 'fraction__number--invalid': validation && validation.validations.denominator === false}">
            <input v-if="editable" :value="inputValueFormatter(denominator)" @input="handleInput({denominator: $event.target.value})" class="fraction__input" />

            <span v-if="editable && denominator < 0" @click="toggleSign({denominator})" class="fraction__subsign">
                
            </span>

            <span :class="{'fraction__input': true, 'fraction__input--disabled': !editable}">
                {{inputValueFormatter(denominator)}}
            </span>
        
        </div>
        <div v-if="negative" class="fraction__sign fraction__sign--close">
            <span>)</span>
        </div>
    </div>
</template>

<script>

import numericOperations from '@/mixins/numericOperations'

export default {
    props: {
        id: [String,Number], 
        numerator: [Number, String],
        denominator: [Number, String],
        operation: String,
        negative: Boolean,
        validation: Object, 
        editable: {
            type: Boolean,
            default: true
        }
    },
    mixins: [numericOperations],
    methods: {
        toggleSign(value) {
            if(value.denominator) {
                value.denominator = this.isNumeric(value.denominator) ? Math.abs(value.denominator) : value.denominator
            }
            if(value.numerator) {
                value.numerator = this.isNumeric(value.numerator) ? Math.abs(value.numerator) : value.numerator
            }

            this.handleInput(value)
        },
        inputValueFormatter(value) {
            return this.isNumeric(value) ? Math.abs(value) : value
        },
        handleInput(value) {
            const { id, denominator, numerator, operation, validation } = this
            const fraction = {id, denominator, numerator, operation, ...value}
            this.$emit('input', fraction)
        }
    },
}
</script>

<style lang="stylus">
.fraction
    position: relative;
    padding-left: 1rem;

    &--negative
        padding-left: 3.5rem;
        padding-right: 3rem;
    
.fraction__number
    position: relative;
    font-size: 2.4rem;

    .fraction__input
        padding: 0.5rem 1rem;
        height: 3.7rem;
        line-height: 1;

    &--denominator
        padding-top: 0.5rem;
        margin-top: 0.5rem;

        .fraction__subsign
            top: auto;
            bottom: 0;

        input.fraction__input
            top: 0.5rem;

        &::after
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 1px;
            background-color: #000;
            content: '';
    
    &--invalid
        .fraction__input
            border: 1px solid #f00;

.fraction__sign
    position: absolute;
    top: 49%;
    left: 0;
    transform: translateY(-50%) translateX(-100%);
    vertical-align: middle;

    .fraction__input
        min-height: 2.5rem;
    
    &--negative
        left: 3.2rem;
        font-size: 2.4rem;
        letter-spacing: 2px;
    
    &--close
        right: 0;
        left: auto;
        font-size: 2.4rem;
        letter-spacing: 2px;
    
    &--invalid
        .fraction__input
            border: 1px solid #f00;

.fraction__subsign
    position: absolute;
    left: -2rem;
    top: 0;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    text-align: center;
    font-size: 1.4rem;
    background: #ff8080;
    color: #fff;
    opacity: 1;
    z-index: 25;
    &:hover 
        background-color: #5ac85a;
        &::before
            line-height: 1.4rem;
            content: '+';
            font-size: 1.2rem;

    &::before
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: 1.1rem;
        content: '-';

.fraction__toggle
    position: absolute;
    bottom: 0;
    left: -0.5rem;


.fraction__input
    padding: 0.5rem;
    display: inline-block;
    border-radius: 6px;
    min-width: 2.5rem;
    text-align: center;
    border: 1px solid rgba(grey, 0.15);
    background-color: #fff;
    width: 100%;
    opacity: 0;

    &:focus
        outline: none;

    &[contenteditable='false'], &--disabled
        background-color: rgba(grey, 0.05);
        opacity: 1;

input.fraction__input
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 25;
    opacity: 1;
</style>

