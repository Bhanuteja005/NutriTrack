import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase'; // Adjust the import path as needed

function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            const fetchBookmarks = async () => {
                const q = query(collection(db, 'bookmarks'), where('uid', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const bookmarksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBookmarks(bookmarksData);
            };

            fetchBookmarks();
        }
    }, [user]);

    const handleRemoveBookmark = async (id) => {
        await deleteDoc(doc(db, 'bookmarks', id));
        setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    };

    return (
        <div className="pt-[10vh] flex flex-col items-center min-h-screen">
            <div className="text-4xl font-semibold mb-4 text-green-600">Bookmarks</div>
            <div className="w-full max-w-2xl">
                {bookmarks.length === 0 ? (
                    <div className="text-center text-gray-500">No bookmarks yet.</div>
                ) : (
                    <ul className="list-none p-0">
                        {bookmarks.map((bookmark) => (
                            <li key={bookmark.id} className="mb-8 p-4 border rounded-lg shadow-lg bg-white">
                                <div dangerouslySetInnerHTML={{ __html: bookmark.recipeName }} />
                                <button
                                    onClick={() => handleRemoveBookmark(bookmark.id)}
                                    className="bg-red-500 text-white p-2 rounded mt-4"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Bookmarks;