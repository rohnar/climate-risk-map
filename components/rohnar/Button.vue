<template>
    <button class="rohnar-button">
        <slot></slot>
    </button>
</template>

<style scoped>
    .rohnar-button {
        background-color: #b6d9d9;
        cursor: pointer;
        border: #698e8e solid 2px;
        padding: 5px 8px;
        border-radius: 5px;
    }
    .rohnar-button:hover {
        box-shadow: 2px 2px 8px;
    }
</style>