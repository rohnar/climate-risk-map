// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    modules: [
        'nuxt-windicss',
        '@element-plus/nuxt'
    ],
    elementPlus: { /** Options */ },
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css'
    ]
})
