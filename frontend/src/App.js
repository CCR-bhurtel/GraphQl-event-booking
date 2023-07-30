import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

function App() {
    const [authenticated, setAuthenticated] = useState(false);

    return (
        <BrowserRouter>
            <>
                <MainNavigation />
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/events" Component={Events} />
                    <Route path="/bookings" Component={Bookings} />
                </Routes>
            </>
        </BrowserRouter>
    );
}

export default App;
