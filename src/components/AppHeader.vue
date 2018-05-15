<template>
    <header class="header">
        <nav class="header__nav">
            <ul class="header__list">
                <li class="header__item">
                    <router-link 
                        class="header__link" 
                        active-class="header__link--active" 
                        :to="{name: 'FractionCalculator'}"
                    >
                        Калькулятор дробей
                    </router-link>
                </li>
                <li class="header__item">
                    <router-link 
                        class="header__link" 
                        active-class="header__link--active" 
                        :to="{name: 'CommentsBoard'}"
                    >
                        Комментарии
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style lang="stylus">
@require '~@/styles/component'


.header__nav
    background-color: #fff;

.header__list
    list-reset();
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

.header__item
    &:last-child
        .header__link
            border-right: 1px solid rgba(grey, 0.1);

.header__link
    display: block;
    border-left: 1px solid rgba(grey, 0.1);
    padding-top: 2rem;
    padding-bottom: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
    font-size: 1.4rem;
    text-transform: uppercase;
</style>

