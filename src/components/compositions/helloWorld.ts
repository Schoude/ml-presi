import { ref } from 'vue';

export default function useHelloWorld(mySetup: string) {
  const myCFunctionString = ref('cool ' + mySetup)

  return { myCFunctionString }
}