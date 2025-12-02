console.log("[BOOT] main.jsx");
const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("[BOOT] typeof App:", typeof App);
root.render(React.createElement(App));