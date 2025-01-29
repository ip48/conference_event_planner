import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";

const ConferenceEvent = () => {
    const [showItems, setShowItems] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const venueItems = useSelector((state) => state.venue);
    const dispatch = useDispatch();
    
    const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;
    const avItems = useSelector((state) => state.av);
    const mealsItems = useSelector((state) => state.meals);

    const handleToggleItems = () => {
        console.log("handleToggleItems called");
        setShowItems(!showItems);
    };

    const handleAddToCart = (index) => {
        if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
            return;
        }
        dispatch(incrementQuantity(index));
    };

    const handleRemoveFromCart = (index) => {
        if (venueItems[index].quantity > 0) {
            dispatch(decrementQuantity(index));
        }
    };

    const handleIncrementAvQuantity = (index) => {
        dispatch(incrementAvQuantity(index));
    };

    const handleDecrementAvQuantity = (index) => {
        dispatch(decrementAvQuantity(index));
    };

    const handleMealSelection = (index) => {
        dispatch(toggleMealSelection(index));
    };

    const getItemsFromTotalCost = () => {
        const items = [];
        
        venueItems.forEach((item) => {
            if (item.quantity > 0) {
                items.push({ ...item, type: "venue" });
            }
        });
        
        avItems.forEach((item) => {
            if (item.quantity > 0 && !items.some((i) => i.name === item.name && i.type === "av")) {
                items.push({ ...item, type: "av" });
            }
        });
        
        mealsItems.forEach((item) => {
            if (item.selected) {
                const itemForDisplay = { ...item, type: "meals" };
                if (item.numberOfPeople) {
                    itemForDisplay.numberOfPeople = numberOfPeople;
                }
                items.push(itemForDisplay);
            }
        });
        
        return items;
    };

    const items = getItemsFromTotalCost();

    const ItemsDisplay = ({ items }) => {
        console.log(items);
        return (
            <div className="display_box1">
                {items.length === 0 && <p>No items selected</p>}
                <table className="table_item_data">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Unit Cost</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>${item.cost}</td>
                                <td>{item.type === "meals" || item.numberOfPeople ? `For ${numberOfPeople} people` : item.quantity}</td>
                                <td>{item.type === "meals" || item.numberOfPeople ? `${item.cost * numberOfPeople}` : `${item.cost * item.quantity}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const calculateTotalCost = (section) => {
        let totalCost = 0;
        if (section === "venue") {
            venueItems.forEach((item) => {
                totalCost += item.cost * item.quantity;
            });
        } else if (section === "av") {
            avItems.forEach((item) => {
                totalCost += item.cost * item.quantity;
            });
        } else if (section === "meals") {
            mealsItems.forEach((item) => {
                if (item.selected) {
                    totalCost += item.cost * numberOfPeople;
                }
            });
        }
        return totalCost;
    };

    const venueTotalCost = calculateTotalCost("venue");
    const avTotalCost = calculateTotalCost("av");
    const mealsTotalCost = calculateTotalCost("meals");

    const navigateToProducts = (idType) => {
        if (["#venue", "#addons", "#meals"].includes(idType) && !showItems) {
            setShowItems(true);
        }
    };

    return (
        <>
            <nav className="navbar_event_conference">
                <div className="company_logo">Conference Expense Planner</div>
                <div className="left_navbar">
                    <div className="nav_links">
                        <a href="#venue" onClick={() => navigateToProducts("#venue")}>Venue</a>
                        <a href="#addons" onClick={() => navigateToProducts("#addons")}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts("#meals")}>Meals</a>
                    </div>
                    <button className="details_button" onClick={() => setShowItems(!showItems)}>
                        Show Details
                    </button>
                </div>
            </nav>
        </>
    );
};

export default ConferenceEvent;
