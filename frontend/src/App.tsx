import { Category } from "./types.ts";

// Component Imports
import CategoryManagement from './components/specific/CategoryManagement/CategoryManagement';

function App() {

    /**
     * This is the final callback. It receives the filtered list
     * of categories and groups to be analyzed.
     */
    const handleRunAnalysis = (selection: Category[]) => {
        console.log("APP: Running analysis on the following selection:", selection);

        // You can see the structure in the console
        let alertMessage = "Running Analysis On:\n";
        selection.forEach(cat => {
            alertMessage += `\nCategory: ${cat.name}`;
            cat.groups.forEach(group => {
                alertMessage += `\n  - Group: ${group.name} (${group.keywords.length} keywords)`;
            });
        });

        alert(alertMessage);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            {/* App.tsx is now clean. All logic is encapsulated inside
                CategoryManagement. We just tell it what to do when
                analysis is requested.
             */}
            <CategoryManagement
                onRunAnalysis={handleRunAnalysis}
            />
        </div>
    );
}

export default App;