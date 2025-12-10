import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
        navigate('/dashboard');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl mb-4">Login</h2>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="mb-4 p-2 border rounded w-full" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="mb-4 p-2 border rounded w-full" required />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded w-full">Login</button>
            </form>
        </div>
    );
};

export default Login;