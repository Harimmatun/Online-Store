import { useCart } from '../context/CartContext';
import styled from 'styled-components';

const CartWrapper = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const CartTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  color: #1e2a44;
  text-align: center;
  margin-bottom: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ItemTitle = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #1e2a44;
`;

const ItemPrice = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #3b82f6;
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #dc2626;
  }
`;

const Total = styled.div`
  margin-top: 2rem;
  text-align: right;
`;

const TotalText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #1e2a44;
`;

const ClearButton = styled.button`
  background: #f97316;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #ea580c;
  }
`;

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <CartWrapper>
        <CartTitle>Кошик</CartTitle>
        <p>Ваш кошик порожній</p>
      </CartWrapper>
    );
  }

  return (
    <CartWrapper>
      <CartTitle>Кошик</CartTitle>
      {cart.map(item => (
        <CartItem key={item.id}>
          <ItemTitle>
            {item.title} (x{item.quantity})
          </ItemTitle>
          <div>
            <ItemPrice>{item.price * item.quantity} грн</ItemPrice>
            <RemoveButton onClick={() => removeFromCart(item.id)}>Видалити</RemoveButton>
          </div>
        </CartItem>
      ))}
      <Total>
        <TotalText>Загальна сума: {total} грн</TotalText>
        <ClearButton onClick={clearCart}>Очистити кошик</ClearButton>
      </Total>
    </CartWrapper>
  );
}

export default Cart;