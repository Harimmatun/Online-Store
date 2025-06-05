import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Додано useNavigate
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

const CartPopupWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const CartButton = styled.div`
  cursor: pointer;
  background: #3b82f6;
  color: #ffffff;
  padding: 0.8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 0.3s ease;

  &:hover {
    background: #2563eb;
  }
`;

const CartIcon = styled.span`
  font-size: 1.5rem;
`;

const CartCount = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: #ffffff;
  border-radius: 50%;
  padding: 0 6px;
  font-size: 0.8rem;
`;

const CartPopupContent = styled.div<{ isOpen: boolean }>`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 300px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  color: #1e2a44;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ItemTitle = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
`;

const ItemPrice = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  color: #3b82f6;
`;

function CartPopup() {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Додано useNavigate

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    setIsOpen(false); // Закриваємо при кліку
    navigate('/cart'); // Перехід на сторінку кошика через react-router
  };

  return (
    <CartPopupWrapper>
      <CartButton
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={handleCartClick}
      >
        <CartIcon>🛒</CartIcon>
        {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
      </CartButton>
      <CartPopupContent isOpen={isOpen}>
        {cart.length === 0 ? (
          <p>Кошик порожній</p>
        ) : (
          cart.map(item => (
            <CartItem key={item.id}>
              <ItemTitle>
                {item.title} (x{item.quantity})
              </ItemTitle>
              <ItemPrice>{item.price * item.quantity} грн</ItemPrice>
            </CartItem>
          ))
        )}
      </CartPopupContent>
    </CartPopupWrapper>
  );
}

export default CartPopup;