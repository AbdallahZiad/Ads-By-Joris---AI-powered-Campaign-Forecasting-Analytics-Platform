import Collapsible from './components/common/Collapsable/Collapsible.tsx';

function App() {
    return (
        <div className="p-8">
            <Collapsible title="Scan a website" initialOpen={true}>
                {/* Your content from the image goes here */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label htmlFor="website-url" className="block text-sm font-medium text-gray-700">Website URL *</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                https://
              </span>
                            <input
                                type="text"
                                name="website-url"
                                id="website-url"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                placeholder="example.com"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="crawl-depth" className="block text-sm font-medium text-gray-700">Crawl Depth *</label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <button className="p-2 border-r border-gray-300">-</button>
                            <span className="p-2">01</span>
                            <button className="p-2 border-l border-gray-300">+</button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="max-pages" className="block text-sm font-medium text-gray-700">Max Pages *</label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <button className="p-2 border-r border-gray-300">-</button>
                            <span className="p-2">01</span>
                            <button className="p-2 border-l border-gray-300">+</button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="max-keywords" className="block text-sm font-medium text-gray-700">Max Keywords *</label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <button className="p-2 border-r border-gray-300">-</button>
                            <span className="p-2">01</span>
                            <button className="p-2 border-l border-gray-300">+</button>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center">
                    <input
                        id="extract-keywords"
                        name="extract-keywords"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="extract-keywords" className="ml-2 block text-sm text-gray-900">
                        Extract keywords from Headlines Only (H1-H6)
                    </label>
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        Scan Website
                    </button>
                </div>
            </Collapsible>

            <Collapsible title="Fortune 500 Companies">
                <Collapsible title="Apple">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Samsung">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Sony">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Apple">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Samsung">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Sony">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Apple">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Samsung">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Sony">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Apple">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Samsung">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Sony">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Apple">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Samsung">
                    <p>This is a category</p>
                </Collapsible>
                <Collapsible title="Sony">
                    <p>This is a category</p>
                </Collapsible>
            </Collapsible>
        </div>
    );
}

export default App;