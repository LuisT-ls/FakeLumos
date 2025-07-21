// realtimeSearch.js

// Função para buscar resultados no Google Custom Search
export async function searchGoogleCustom(query) {
  // Substitua pelas suas chaves reais
  const apiKey = 'SUA_GOOGLE_API_KEY'
  const cx = 'SEU_CX_ID'
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&key=${apiKey}&cx=${cx}&hl=pt`
  try {
    const response = await fetch(url)
    if (!response.ok) return []
    const data = await response.json()
    if (data.items && data.items.length > 0) {
      return data.items.map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet
      }))
    }
    return []
  } catch (e) {
    return []
  }
}
