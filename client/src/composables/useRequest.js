import axios from 'axios'
import { computed, reactive } from 'vue'

const activeRequests = reactive([])

export default function useRequests() {
  const isLoading = computed(() => !!activeRequests.length)

  const makeRequest = async (type, url, data) => {
    let response
    const index = activeRequests.length
    activeRequests[index] = url

    switch (type) {
      case 'GET':
        response = await axios.get(url)
        break

      case 'POST':
        response = await axios.post(url, { ...data })
        break
    }

    activeRequests.splice(index, 1)
    return response
  }
  return { isLoading, makeRequest }
}
