import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setTheme } from './store/slices/themeSlice';
import { setBookmarkedIds } from './store/slices/postsSlice';

function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { bookmarkedPostIds } = useSelector((state) => state.posts);

  useEffect(() => {
    const savedTheme = localStorage.getItem('aura-theme');
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      dispatch(setTheme('dark'));
    }
    try {
      const savedBookmarks = JSON.parse(localStorage.getItem('aura-bookmarks') || '[]')
      dispatch(setBookmarkedIds(savedBookmarks))
    } catch (error) {
      console.error('Failed to load bookmarks', error)
    }
  }, [dispatch]);

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('aura-theme', mode)
  }, [mode])

  useEffect(() => {
    try {
      localStorage.setItem('aura-bookmarks', JSON.stringify(bookmarkedPostIds))
    } catch (error) {
      console.error('Failed to save bookmarks', error)
    }
  }, [bookmarkedPostIds])

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostDetailPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/edit/:slug" element={<CreatePostPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;