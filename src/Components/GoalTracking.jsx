import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaCheck, FaTrash } from 'react-icons/fa';
import { auth, db } from '../config/firebase'; // Adjust the import path as needed

function GoalTracking() {
    const [goals, setGoals] = useState([]);
    const [goalInput, setGoalInput] = useState('');
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            const fetchGoals = async () => {
                const q = query(collection(db, 'goals'), where('uid', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const goalsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setGoals(goalsData);
            };

            fetchGoals();
        }
    }, [user]);

    const handleAddGoal = async () => {
        if (goalInput.trim() !== '') {
            const newGoal = { text: goalInput, completed: false, uid: user.uid };
            const docRef = await addDoc(collection(db, 'goals'), newGoal);
            setGoals([...goals, { id: docRef.id, ...newGoal }]);
            setGoalInput('');
        }
    };

    const handleInputChange = (e) => {
        setGoalInput(e.target.value);
    };

    const handleCompleteGoal = async (id) => {
        const goalRef = doc(db, 'goals', id);
        await updateDoc(goalRef, { completed: true });
        setGoals(goals.map(goal => goal.id === id ? { ...goal, completed: true } : goal));
    };

    const handleUpdateGoal = async (id, newText) => {
        const goalRef = doc(db, 'goals', id);
        await updateDoc(goalRef, { text: newText });
        setGoals(goals.map(goal => goal.id === id ? { ...goal, text: newText } : goal));
    };

    const handleRemoveGoal = async (id) => {
        const goalRef = doc(db, 'goals', id);
        await deleteDoc(goalRef);
        setGoals(goals.filter(goal => goal.id !== id));
    };

    return (
        <div className="pt-[10vh] flex flex-col items-center min-h-screen">
            <div className="text-4xl font-semibold mb-4 text-green-600">Goal Tracking</div>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={goalInput}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-l w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your goal"
                />
                <button
                    onClick={handleAddGoal}
                    className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Add Goal
                </button>
            </div>
            <div className="w-full max-w-md">
                <div className="mb-4">
                    <div className="text-2xl font-semibold mb-2 text-green-600">Active Goals</div>
                    <ol className="list-none p-0">
                        {goals.filter(goal => !goal.completed).map((goal, index) => (
                            <li key={goal.id} className="mb-2 flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                <input
                                    type="text"
                                    value={goal.text}
                                    onChange={(e) => handleUpdateGoal(goal.id, e.target.value)}
                                    className="border border-gray-300 p-1 rounded w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleCompleteGoal(goal.id)}
                                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={() => handleRemoveGoal(goal.id)}
                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                <div>
                    <div className="text-2xl font-semibold mb-2 text-green-600">Completed Goals</div>
                    <ol className="list-none p-0">
                        {goals.filter(goal => goal.completed).map((goal, index) => (
                            <li key={goal.id} className="mb-2 flex justify-between items-center p-4 bg-gray-200 border border-gray-300 rounded-lg shadow-sm">
                                <span className="w-64 line-through text-gray-500">{goal.text}</span>
                                <button
                                    onClick={() => handleRemoveGoal(goal.id)}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default GoalTracking;