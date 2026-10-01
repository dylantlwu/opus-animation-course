import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import AnimDemo from './AnimDemo.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AnimDemo', AnimDemo)
  },
} satisfies Theme
