import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaTrash } from 'react-icons/fa';
import { auth, db } from '../config/firebase'; // Adjust the import path as needed

function ShoppingList() {
    const [items, setItems] = useState([]);
    const [itemInput, setItemInput] = useState('');
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            const fetchItems = async () => {
                const q = query(collection(db, 'shoppingList'), where('uid', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setItems(itemsData);
            };

            fetchItems();
        }
    }, [user]);

    const handleAddItem = async () => {
        if (itemInput.trim() !== '') {
            const newItem = { text: itemInput, purchased: false, uid: user.uid };
            const docRef = await addDoc(collection(db, 'shoppingList'), newItem);
            setItems([...items, { id: docRef.id, ...newItem }]);
            setItemInput('');
        }
    };

    const handleInputChange = (e) => {
        setItemInput(e.target.value);
    };

    const handleRemoveItem = async (id) => {
        await deleteDoc(doc(db, 'shoppingList', id));
        setItems(items.filter(item => item.id !== id));
    };

    const handleTogglePurchased = async (id) => {
        const item = items.find(item => item.id === id);
        const itemRef = doc(db, 'shoppingList', id);
        await updateDoc(itemRef, { purchased: !item.purchased });
        setItems(items.map(item => item.id === id ? { ...item, purchased: !item.purchased } : item));
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="pt-[5vh] flex flex-col items-center w-full max-w-4xl">
                <div className="text-4xl font-semibold mb-4 text-green-600">Shopping List</div>
                <div className="flex mb-4">
                    <input
                        type="text"
                        value={itemInput}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 rounded-l w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter item"
                    />
                    <button
                        onClick={handleAddItem}
                        className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Add Item
                    </button>
                </div>
                <div className="w-full max-w-md">
                    <ul className="list-none p-0">
                        {items.map((item) => (
                            <li key={item.id} className="mb-2 flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                <span
                                    className={`w-64 cursor-pointer ${item.purchased ? 'line-through text-gray-500' : ''}`}
                                    onClick={() => handleTogglePurchased(item.id)}
                                >
                                    {item.text}
                                </span>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ShoppingList;