export default {
    name: 'numericOperations',
    methods: {
        isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n)
        },
    }
}