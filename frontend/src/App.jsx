import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import HomePage from './components/HomePage';
import AccountPage from './components/Account';
import MyPostsPage from './components/MyPosts';
import Header from './components/Header';
import SinglePost from './components/SinglePost';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);

    const fetchPosts = async () => {
        setIsDataLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/v1/recipes');
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
            <Header isAuthenticated={isAuthenticated} onLogout={onLogout} />
            <Routes>
                <Route path="/" element={<HomePage posts={posts} />} />
                <Route path="/login" element={<AuthForm onLoginSuccess={onLoginSuccess} />} />
                <Route path="/register" element={<AuthForm onLoginSuccess={onLoginSuccess} />} />
                <Route path="/my-posts" element={<MyPostsPage onPostCreated={fetchPosts} />} />
                <Route path="/account" element={<AccountPage onLogout={onLogout} />} />
                <Route path="/posts/:postId" element={<SinglePost isAuthenticated={isAuthenticated} />} />
            </Routes>
        </Router>
    );
}

export default App;