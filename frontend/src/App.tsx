import { useState } from 'react';
import KeywordList from './components/specific/KeywordList/KeywordList.tsx';
import Collapsible from "./components/common/Collapsable/Collapsible.tsx";

function App() {
    const [myKeywords, setMyKeywords] = useState(['macbook pro', 'macbook air', 'imac', 'mac mini', 'mac studio']);

    const handleSaveKeywords = (newKeywords: string[]) => {
        console.log('Keywords saved:', newKeywords);
        setMyKeywords(newKeywords); // Update parent state
        // You might also send these to an API here
    };

    const handleCopyKeywords = (keywordsText: string) => {
        console.log('Keywords copied:', keywordsText);
        // User feedback (e.g., a toast notification) could be added here
    };

    const handleEditKeywords = () => {
        console.log('Entering edit mode');
    };

    return (
        <div className="p-8 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Category Management</h1>
            <Collapsible title="Tech Products">
                <Collapsible title="Apple Products">
                    <KeywordList
                        keywords={myKeywords}
                        onSave={handleSaveKeywords}
                        onCopy={handleCopyKeywords}
                        onEdit={handleEditKeywords}
                    />
                </Collapsible>
            </Collapsible>

            <Collapsible title="Test">
                <Collapsible title="Test">

                <Collapsible title="Test 2">
                    Hello
                </Collapsible>
                </Collapsible>
            </Collapsible>
            <div className="mt-8 p-4 bg-blue-50 rounded-md">
                <h2 className="text-lg font-semibold">Current Keywords in Parent State:</h2>
                <ul>
                    {myKeywords.map((keyword, index) => (
                        <li key={index} className="text-gray-700">{keyword}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;