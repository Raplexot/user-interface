import { Ref, ref } from 'vue'
import { Router } from 'vue-router'

const error:Ref<null | string> = ref(null)

const handleCurrentError = (router: Router, currentError:string) => {
  error.value = currentError
  router.push('/error')
}

const useHandleError = () => {
  return { error, handleCurrentError }
}

export default useHandleError
