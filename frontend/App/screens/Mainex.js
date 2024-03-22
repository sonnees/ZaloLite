/* This file has been downloaded from rnexamples.com */
/* If You want to help us please go here https://www.rnexamples.com/help-us */
import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from 'react-native';


const ProductCard = ({ item, onIncrement, onDecrement }) => {
  return (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)} <Text style={styles.productPriceText}>per item</Text></Text>
      </View>
      <View style={styles.productAmount}>
        <TouchableOpacity style={styles.amountButton} onPress={onDecrement}>
          <Text style={styles.amountButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.amountText}>{item.amount}</Text>
        <TouchableOpacity style={styles.amountButton} onPress={onIncrement}>
          <Text style={styles.amountButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Mainex = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Hamburger', description: 'Juicy beef patty on a fresh bun with all the fixings', price: 5.99, image: 'https://source.unsplash.com/900x900/?burger', amount: 0 },
    { id: 2, name: 'Pizza', description: 'Freshly made pizza with your choice of toppings', price: 9.99, image: 'https://source.unsplash.com/900x900/?pizza', amount: 0 },
    { id: 3, name: 'Salad', description: 'Fresh greens and veggies with your choice of dressing', price: 4.99, image: 'https://source.unsplash.com/900x900/?salad', amount: 0 },
    { id: 4, name: 'Fries', description: 'Crispy and delicious, perfect as a side or on their own', price: 2.99, image: 'https://source.unsplash.com/900x900/?fries', amount: 0 },
    { id: 5, name: 'Ice Cream', description: 'Rich and creamy, the perfect dessert any time of day', price: 3.99, image: 'https://source.unsplash.com/900x900/?icecream', amount: 0 },
    
    { id: 6, name: 'Big Hamburger', description: 'Juicy beef patty on a fresh bun with all the fixings', price: 5.99, image: 'https://source.unsplash.com/900x900/?burger', amount: 0 },
    { id: 7, name: 'Big Pizza ', description: 'Freshly made pizza with your choice of toppings', price: 9.99, image: 'https://source.unsplash.com/900x900/?pizza', amount: 0 },
    { id: 8, name: 'Big Salad', description: 'Fresh greens and veggies with your choice of dressing', price: 4.99, image: 'https://source.unsplash.com/900x900/?salad', amount: 0 },
    { id: 9, name: 'Big Fries', description: 'Crispy and delicious, perfect as a side or on their own', price: 2.99, image: 'https://source.unsplash.com/900x900/?fries', amount: 0 },
    { id: 10, name: 'Big Ice Cream', description: 'Rich and creamy, the perfect dessert any time of day', price: 3.99, image: 'https://source.unsplash.com/900x900/?icecream', amount: 0 },
  ]);

  const handleIncrement = (item) => {
    setProducts(
      products.map((product) =>
        product.id === item.id ? { ...product, amount: product.amount + 1 } : product
      )
    );
  };

  const handleDecrement = (item) => {
    setProducts(
      products.map((product) =>
        product.id === item.id ? { ...product, amount: Math.max(0, product.amount - 1) } : product
      )
    );
  };

  const renderProductItem = ({ item }) => (
    <ProductCard item={item} onIncrement={() => handleIncrement(item)} onDecrement={() => handleDecrement(item)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        style={styles.productList}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
      />
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop:40,
  },
  productList: {
    flex: 1,
    paddingTop: 16,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  productPriceText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666',
  },
  productAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountButton: {
    width: 30,
    height: 30,
    backgroundColor: '#ffa726',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  continueButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Mainex;
