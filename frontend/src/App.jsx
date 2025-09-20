import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm.jsx';
import HomePage from './components/HomePage.jsx';
import AccountPage from './components/Account.jsx';
import MyPostsPage from './components/MyPosts.jsx';
import Header from './components/Header.jsx';
import SinglePost from './components/SinglePost.jsx';
import Footer from './components/Footer.jsx';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);

    const fetchPosts = async () => {
        setIsDataLoading(true);
        try {
          
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/recipes`);
            if (!response.ok) {
                throw new Error('Impossibile caricare i post');
            }
            const data = await response.json();
            setPosts(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDataLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
        fetchPosts();
    }, []);

    const onLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const onLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        fetchPosts();
    };

    return (
        <Router>
            <div className="d-flex flex-column min-vh-100"> 
                
            <Header isAuthenticated={isAuthenticated} onLogout={onLogout} />
                  <main className="flex-grow-1">
            <Routes>
                <Route path="/" element={<HomePage posts={posts} />} />
                <Route path="/login" element={<AuthForm onLoginSuccess={onLoginSuccess} />} />
                <Route path="/register" element={<AuthForm onLoginSuccess={onLoginSuccess} />} />
                <Route path="/my-posts" element={<MyPostsPage onPostCreated={fetchPosts} />} />
                <Route path="/account" element={<AccountPage onLogout={onLogout} />} />
                <Route path="/posts/:postId" element={<SinglePost isAuthenticated={isAuthenticated} />} />
            </Routes>
                  </main>
            <Footer />

                </div>
        </Router>
    );
}

export default App;
