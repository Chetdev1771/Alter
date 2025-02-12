import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp } from "firebase/app";
import TopicAnalytics from "./Analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD_aOGeNArk7E7_SRlLXkl6CnR80k2qSxs",
    authDomain: "alter-21e5a.firebaseapp.com",
    projectId: "alter-21e5a",
    storageBucket: "alter-21e5a.firebasestorage.app",
    messagingSenderId: "699025512589",
    appId: "1:699025512589:web:0bd484471061cc76182ac4",
};

const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const firebaseAuth = getAuth(firebaseApp);


const Shortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [topic, setTopic] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [token,setToken]=useState("");
  

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const token = await result.user.getIdToken(true); // Force refresh token
      console.log("New Token:", token);
      setToken(token);
      localStorage.setItem("token", token); // Store in localStorage
      setUser({ name: result.user.displayName, token });
      toast.success("Login successful!");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Authentication failed");
    }
  };
  

  // Handle URL Shortening
  const handleShorten = async () => {
    if (!longUrl) return toast.error("Please enter a URL");
    if (!user) return toast.error("Please sign in first");

    try {
      const response = await fetch("http://localhost:5000/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization:`Bearer ${user.token}`},
        body: JSON.stringify({ longUrl, customAlias, topic }),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setShortUrl(data.shortUrl);
        toast.success("URL shortened successfully!");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

    // Fetch Analytics
// Fetch Analytics (Now Refreshes Token First)
const handleViewAnalytics = async () => {
    if (!shortUrl) return toast.error("Shorten a URL first!");
    if (!user) return toast.error("Please sign in first");
  
    try {
      // 🔹 Refresh the Firebase Token before making a request
      const updatedToken = await firebaseAuth.currentUser.getIdToken(true);
      setUser({ ...user, token: updatedToken }); // Update token in state
  
      const alias = shortUrl.split("/").pop(); // Extract alias from short URL
      const response = await fetch(`http://localhost:5000/api/analytics/${alias}`, {
        headers: { Authorization: `Bearer ${updatedToken}` }, // 🔥 Use updated token
      });
  
      const data = await response.json();
      if (response.ok) {
        setAnalytics(data);
      } else {
        toast.error("Error fetching analytics");
      }
    } catch (error) {
      console.error("Analytics error:", error);
      toast.error("Something went wrong");
    }
  };
  

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <ToastContainer />
      {!user ? (
        <button onClick={handleGoogleSignIn} style={{ padding: "10px", backgroundColor: "#4285F4", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" }}>
          Sign in with Google
        </button>
      ) : (
        <>
          <h2>URL Shortener</h2>
          <input
            type="text"
            placeholder="Enter long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px" }}
          />
          <input
            type="text"
            placeholder="Custom Alias (optional)"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px" }}
          />
          <input
            type="text"
            placeholder="Topic (optional)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px" }}
          />
          <button onClick={handleShorten} style={{ padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" }}>
            Shorten URL
          </button>
          
          {/* {shortUrl && (
            <p>
                Short URL:{" "}
                <a href={longUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
                </a>
            </p>
            )} */}

{shortUrl && (
            <div style={{ marginTop: "10px" }}>
              <p>
                Short URL:{" "}
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  {shortUrl}
                </a>
              </p>
              <button onClick={handleViewAnalytics} style={{ padding: "10px", backgroundColor: "#17a2b8", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" }}>
                View Analytics
              </button>

              {analytics && (
                <div style={{ marginTop: "10px", textAlign: "left", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                  <h3>Analytics</h3>
                  <p><strong>Total Clicks:</strong> {analytics.totalClicks}</p>
                  <p><strong>Unique Users:</strong> {analytics.uniqueUsers}</p>
                  <h4>Clicks by Date (Last 7 Days)</h4>
                  {analytics.clicksByDate.map((day) => (
                    <p key={day.date}>
                      {day.date}: {day.clickCount} clicks
                    </p>
                  ))}
                  <h4>OS Distribution</h4>
                  {analytics.osType.map((os) => (
                    <p key={os.osName}>
                      {os.osName}: {os.uniqueClicks} clicks from {os.uniqueUsers} users
                    </p>
                  ))}
                  <h4>Device Distribution</h4>
                  {analytics.deviceType.map((device) => (
                    <p key={device.deviceName}>
                      {device.deviceName}: {device.uniqueClicks} clicks from {device.uniqueUsers} users
                    </p>
                  ))}
                </div>
              )}
              <TopicAnalytics token={token}/>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shortener;


// import React, { useState } from "react";
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyD_aOGeNArk7E7_SRlLXkl6CnR80k2qSxs",
//   authDomain: "alter-21e5a.firebaseapp.com",
//   projectId: "alter-21e5a",
//   storageBucket: "alter-21e5a.firebasestorage.app",
//   messagingSenderId: "699025512589",
//   appId: "1:699025512589:web:0bd484471061cc76182ac4",
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// const provider = new GoogleAuthProvider();
// const firebaseAuth = getAuth(firebaseApp);

// const Shortener = () => {
//   const [longUrl, setLongUrl] = useState("");
//   const [customAlias, setCustomAlias] = useState("");
//   const [topic, setTopic] = useState("");
//   const [shortUrl, setShortUrl] = useState("");
//   const [user, setUser] = useState(null);
//   const [analytics, setAnalytics] = useState(null);

//   // Handle Google Sign-In
//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(firebaseAuth, provider);
//       const token = await result.user.getIdToken();
//       setUser({ name: result.user.displayName, token });
//       toast.success("Login successful!");
//     } catch (error) {
//       console.error("Authentication error:", error);
//       toast.error("Authentication failed");
//     }
//   };

//   // Handle URL Shortening
//   const handleShorten = async () => {
//     if (!longUrl) return toast.error("Please enter a URL");
//     if (!user) return toast.error("Please sign in first");

//     try {
//       const response = await fetch("http://localhost:5000/api/shorten", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`, // Fixed token sending
//         },
//         body: JSON.stringify({ longUrl, customAlias, topic }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setShortUrl(data.shortUrl);
//         toast.success("URL shortened successfully!");
//       } else {
//         toast.error(data.error);
//       }
//     } catch (error) {
//       console.error("Shorten URL error:", error);
//       toast.error("Something went wrong");
//     }
//   };

//   // Fetch Analytics
//   const handleViewAnalytics = async () => {
//     if (!shortUrl) return toast.error("Shorten a URL first!");
//     if (!user) return toast.error("Please sign in first");

//     try {
//       const alias = shortUrl.split("/").pop(); // Extract alias from short URL
//       const response = await fetch(`http://localhost:5000/api/analytics/${alias}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setAnalytics(data);
//       } else {
//         toast.error("Error fetching analytics");
//       }
//     } catch (error) {
//       console.error("Analytics error:", error);
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
//       <ToastContainer />
      
//       {!user ? (
//         <button onClick={handleGoogleSignIn} style={{ padding: "10px", backgroundColor: "#4285F4", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" }}>
//           Sign in with Google
//         </button>
//       ) : (
//         <>
//           <h2>URL Shortener</h2>
//           <input
//             type="text"
//             placeholder="Enter long URL"
//             value={longUrl}
//             onChange={(e) => setLongUrl(e.target.value)}
//             style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px" }}
//           />
//           <input
//             type="text"
//             placeholder="Custom Alias (optional)"
//             value={customAlias}
//             onChange={(e) => setCustomAlias(e.target.value)}
//             style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px" }}
//           />
//           <input
//             type="text"
//             placeholder="Topic (optional)"
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//             style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px" }}
//           />
//           <button onClick={handleShorten} style={{ padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px", marginRight: "5px" }}>
//             Shorten URL
//           </button>
          
//           {shortUrl && (
//             <div style={{ marginTop: "10px" }}>
//               <p>
//                 Short URL:{" "}
//                 <a href={longUrl} target="_blank" rel="noopener noreferrer">
//                   {shortUrl}
//                 </a>
//               </p>
//               <button onClick={handleViewAnalytics} style={{ padding: "10px", backgroundColor: "#17a2b8", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" }}>
//                 View Analytics
//               </button>

//               {analytics && (
//                 <div style={{ marginTop: "10px", textAlign: "left", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
//                   <h3>Analytics</h3>
//                   <p><strong>Total Clicks:</strong> {analytics.totalClicks}</p>
//                   <p><strong>Unique Users:</strong> {analytics.uniqueUsers}</p>
//                   <h4>Clicks by Date (Last 7 Days)</h4>
//                   {analytics.clicksByDate.map((day) => (
//                     <p key={day.date}>
//                       {day.date}: {day.clickCount} clicks
//                     </p>
//                   ))}
//                   <h4>OS Distribution</h4>
//                   {analytics.osType.map((os) => (
//                     <p key={os.osName}>
//                       {os.osName}: {os.uniqueClicks} clicks from {os.uniqueUsers} users
//                     </p>
//                   ))}
//                   <h4>Device Distribution</h4>
//                   {analytics.deviceType.map((device) => (
//                     <p key={device.deviceName}>
//                       {device.deviceName}: {device.uniqueClicks} clicks from {device.uniqueUsers} users
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Shortener;
