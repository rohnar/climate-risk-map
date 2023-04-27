<script setup>
const props = defineProps({
    type: {
        type: String,
        default: 'primary'
    }
})
const typeStyle = {
    primary: 'rohnar-button hover:(ring ring-blue-300)',
    success: 'rohnar-button hover:(ring ring-green-300)',
    danger: 'rohnar-button hover:(ring ring-red-300)',
    info: 'rohnar-button hover:(ring ring-yellow-300)',
    text: 'rohnar-text-button hover:(decoration-dotted text-blue-500)'
}
const buttonStyle = typeStyle[props.type]
</script>

<template>
    <button :class="buttonStyle">
        <slot></slot>
    </button>
</template>

<style scoped>
    .rohnar-button {
        border: #b2b2b2 solid 2px;
        padding: 5px 8px;
        border-radius: 5px;
    }
    .rohnar-text-button {
        padding: 5px 10px;
    }
</style>