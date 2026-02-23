import { createContext, useContext, useMemo, useState } from "react"
import { useAuth } from "./AuthContext"

const ArticlesContext = createContext(null)

export function ArticlesProvider({ children }) {
  const { user, isAuthenticated } = useAuth()

  // { username: [articles...] }
  const [savedArticlesByUser, setSavedArticlesByUser] = useState({})

  function getUserSavedArticles() {
    if (!isAuthenticated || !user) return []
    return savedArticlesByUser[user.username] || []
  }

  function isArticleSaved(article) {
    if (!isAuthenticated || !user) return false
    const list = savedArticlesByUser[user.username] || []
    return list.some(a => a?.uri === article?.uri)
  }

  function saveArticle(article) {
    if (!isAuthenticated || !user) return
    setSavedArticlesByUser(prev => {
      const list = prev[user.username] || []
      if (list.some(a => a?.uri === article?.uri)) return prev
      return { ...prev, [user.username]: [...list, article] }
    })
  }

  function removeArticle(article) {
    if (!isAuthenticated || !user) return
    setSavedArticlesByUser(prev => {
      const list = prev[user.username] || []
      return {
        ...prev,
        [user.username]: list.filter(a => a?.uri !== article?.uri),
      }
    })
  }

  function getAllUserArticles() {
    return savedArticlesByUser
  }

  const value = useMemo(
    () => ({
      saveArticle,
      removeArticle,
      isArticleSaved,
      getUserSavedArticles,
      getAllUserArticles,
    }),
    [savedArticlesByUser, user, isAuthenticated]
  )

  return <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>
}

export function useArticles() {
  const ctx = useContext(ArticlesContext)
  if (!ctx) throw new Error("useArticles must be used inside ArticlesProvider")
  return ctx
}