import useRequests from '@/composables/useRequest.js'
import { BaseImageUrl } from '@/constants/api.js'

export default function useResource() {
  const { makeRequest } = useRequests()

  const send = (id, img) => makeRequest('POST', `${ BaseImageUrl }${ id }`, { img })
  const get = (id) => makeRequest('GET', `${ BaseImageUrl }${ id }`)

  return { send, get }
}
