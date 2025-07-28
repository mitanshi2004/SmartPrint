import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Queue.css';
import { Link } from "react-router-dom";



import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 🎯 Sortable Token Item
// 🧠 Inside SortableItem
function SortableItem({ item, isPaid, onJumpClick, showPopupFor, setShowPopupFor }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className={`token-card ${isPaid ? "paid" : ""}`}>
        <span>{item.tokenNumber}</span>

        <div className="token-actions">
          {isPaid ? (
            <span className="paid-label">Paid</span>
          ) : (
            <button
              className="token-badge"
              onClick={() => setShowPopupFor(item.tokenNumber)}
            >
              Jump Queue Now
            </button>
          )}
          <span {...listeners} className="token-drag">&#9776;</span>
        </div>
      </div>

      {showPopupFor === item.tokenNumber && (
        <div className="jump-popup">
          <p>Pay Now</p>
          <p>GET PRIORITY</p>
          <button onClick={() => onJumpClick(item._id, item.tokenNumber)}>Rs → 20</button>
        </div>
      )}
    </div>
  );
}


// 🧠 Main Queue Component
function Queue() {
  const [queue, setQueue] = useState([]);
  const [showPopupFor, setShowPopupFor] = useState(null);
  const [showJumpPopup, setShowJumpPopup] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [tapCount, setTapCount] = useState(0);

  const tapCountRef = useRef({});
  const paidRef = useRef(new Set());

  const sensors = useSensors(useSensor(PointerSensor));

  // 🟢 Fetch queue on mount and poll
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/print/queue", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQueue(res.data);

        // Build paid list from priority=1
        paidRef.current = new Set(res.data.filter(item => item.priority === 1).map(item => item._id));
      } catch (err) {
        console.error("Error fetching queue", err);
      }
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🔁 Triple-tap jump trigger
  const handleTripleTap = (tokenId, tokenNumber) => {
    if (!tapCountRef.current[tokenId])
      tapCountRef.current[tokenId] = { count: 0, timeout: null };

    tapCountRef.current[tokenId].count++;

    clearTimeout(tapCountRef.current[tokenId].timeout);
    tapCountRef.current[tokenId].timeout = setTimeout(() => {
      tapCountRef.current[tokenId].count = 0;
    }, 1500);

    if (tapCountRef.current[tokenId].count === 3) {
      tapCountRef.current[tokenId].count = 0;

      // 👇 Perform jump + close popup
      jumpToken(tokenId);

      // ✅ Hide popup after successful triple tap
      setShowPopupFor(null);
    }
  };

  const handleJumpNowClick = async () => {
    const newTap = tapCount + 1;
    setTapCount(newTap);

    if (newTap >= 3 && selectedTokenId) {
      try {
        await axios.put(`http://localhost:8080/print/jump/${selectedTokenId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 💥 Close popup and refresh queue
        setShowJumpPopup(false);
        setSelectedTokenId(null);
        setTapCount(0);

        // Optionally fetch updated queue
        fetchQueue();
      } catch (err) {
        console.error("Jump failed:", err);
      }
    }
  };

  // 💸 Jump logic (send to backend + reorder)
  const jumpToken = async (tokenId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/print/jump/${tokenId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      paidRef.current.add(tokenId);

      setQueue((prevQueue) => {
        const index = prevQueue.findIndex((item) => item._id === tokenId);
        const updatedQueue = [...prevQueue];
        const [paidToken] = updatedQueue.splice(index, 1);

        // ✅ Place it after last paid token (but before unpaid)
        let lastPaidIndex = 0;
        for (let i = 1; i < updatedQueue.length; i++) {
          if (paidRef.current.has(updatedQueue[i]._id)) {
            lastPaidIndex = i;
          } else {
            break;
          }
        }

        updatedQueue.splice(lastPaidIndex + 1, 0, paidToken);
        return updatedQueue;
      });

      alert("✅ You jumped the queue!");
    } catch (err) {
      console.error("Jump failed", err);
      alert("❌ Failed to jump queue.");
    }
  };

  // ⬆️⬇️ Drag logic
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = queue.findIndex((item) => item._id === active.id);
    const newIndex = queue.findIndex((item) => item._id === over.id);

    if (oldIndex === 0 || newIndex === 0) return;

    const activeIsPaid = paidRef.current.has(active.id);
    const overIsPaid = paidRef.current.has(over.id);

    if (activeIsPaid) {
      if (!overIsPaid || newIndex > oldIndex) {
        alert("❌ Paid tokens can't be dragged down or below unpaid ones.");
        return;
      }
    } else {
      if (newIndex < oldIndex) {
        const above = queue.slice(1, newIndex + 1); // exclude 0 (currently serving)
        const hasPaidAbove = above.some(item => paidRef.current.has(item._id));
        if (hasPaidAbove) {
          setShowPopupFor(queue[oldIndex].tokenNumber);
          return;
        }
      }
    }

    const newQueue = arrayMove(queue, oldIndex, newIndex);
    setQueue(newQueue);
  };

  const currentToken = queue[0]?.tokenNumber || 1;
  const upNext = queue.slice(1);
  const isTraffic = queue.length > 30;

  return (
    <div className="queue-wrapper">
      <div className="queue-box">
        <h2 >SmartQueue</h2>

        <div>
          <span>TOKEN</span>
          <span>QUEUE</span>
        </div>

        <div>
          <span>{currentToken}</span>
          <span style={{ fontSize: "13px" }}><i>Current Status</i></span>

        </div>



        {isTraffic ? (
          <div>🚦 Traffic on Server. Please wait...</div>
        ) : (
          <>
            <p>Up Next</p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={queue.map((item) => item._id)} strategy={verticalListSortingStrategy}>
                {upNext.map((item) => (
                  <SortableItem
                    key={item._id}
                    item={item}
                    isPaid={paidRef.current.has(item._id)}
                    onJumpClick={handleTripleTap}
                    showPopupFor={showPopupFor}
                    setShowPopupFor={setShowPopupFor}
                  />
                ))}
              </SortableContext>
            </DndContext>

          </>
        )}
        <div className="order-more">
          <Link to="/home" className="order-more-link">Visit to Home</Link>
        </div>

      </div>

    </div>
  );
}

export default Queue;
