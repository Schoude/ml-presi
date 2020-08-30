declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

// declare module 'd3' {
//   export default '../node_modules/@types/d3/index.d.ts'
// }