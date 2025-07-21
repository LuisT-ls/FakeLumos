// realtimeSearch.js

// Função para buscar resultados no Google Custom Search
// Lista de domínios confiáveis (whitelist)
const whitelist = [
  'g1.globo.com',
  'bbc.com',
  'cnn.com',
  'nytimes.com',
  'folha.uol.com.br',
  'uol.com.br',
  'estadao.com.br',
  'oglobo.globo.com',
  'reuters.com',
  'dw.com',
  'elpais.com',
  'r7.com',
  'terra.com.br',
  'abril.com.br',
  'veja.abril.com.br',
  'saude.gov.br',
  'gov.br',
  'who.int',
  'opas.org.br',
  'un.org',
  'scielo.br',
  'nature.com',
  'science.org',
  'lancet.com',
  'bvsalud.org',
  'fapesp.br',
  'fiocruz.br',
  'inpe.br',
  'ibge.gov.br',
  'agencia.fiocruz.br',
  'agencia.ibge.gov.br'
]

// Lista de domínios irrelevantes (blacklist)
const blacklist = [
  'instagram.com',
  'facebook.com',
  'tiktok.com',
  'pinterest.com',
  'twitter.com',
  'youtube.com',
  'whatsapp.com',
  'supermercado',
  'loja',
  'mercado',
  'shop',
  'promo',
  'oferta',
  'magazineluiza',
  'americanas',
  'shopee',
  'aliexpress',
  'blogspot.com',
  'wordpress.com',
  'tumblr.com',
  'medium.com',
  'wixsite.com',
  'canva.com',
  'soundcloud.com',
  'vimeo.com',
  'reddit.com',
  'quora.com',
  'ask.fm',
  'curiouscat.me',
  'telegram',
  'snapchat.com',
  'kawai',
  'badoo',
  'tinder',
  'bilibili',
  'weibo',
  'vk.com',
  'ok.ru'
]

export async function searchGoogleCustom(query) {
  const apiKey = 'AIzaSyBCUCD3BN-tKrbR26AeeepxYSs8ihZp7dw'
  const cx = '1777b64403cb2491f'
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&key=${apiKey}&cx=${cx}&hl=pt`
  try {
    const response = await fetch(url)
    if (!response.ok) return []
    const data = await response.json()
    if (data.items && data.items.length > 0) {
      let results = data.items.map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet
      }))
      // Se whitelist não estiver vazia, prioriza apenas domínios confiáveis
      if (whitelist.length > 0) {
        results = results.filter(item =>
          whitelist.some(domain => item.link.toLowerCase().includes(domain))
        )
      }
      // Se não sobrou nada na whitelist, aplica blacklist para remover irrelevantes
      if (results.length === 0) {
        results = data.items
          .filter(
            item =>
              !blacklist.some(bad => item.link.toLowerCase().includes(bad))
          )
          .map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet
          }))
      }
      return results
    }
    return []
  } catch (e) {
    return []
  }
}
