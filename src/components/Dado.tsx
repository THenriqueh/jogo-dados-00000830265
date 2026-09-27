import { Image, StyleSheet } from 'react-native';

const imagens: Record<number, any> = {
  1: require('../../assets/images/dados/1.png'),
  2: require('../../assets/images/dados/2.png'),
  3: require('../../assets/images/dados/3.png'),
  4: require('../../assets/images/dados/4.png'),
  5: require('../../assets/images/dados/5.png'),
  6: require('../../assets/images/dados/6.png'),
};

type DadoProps = {
  valor: number;
};

export default function Dado({ valor }: DadoProps) {
  return <Image source={imagens[valor]} style={styles.dado} />;
}

const styles = StyleSheet.create({
  dado: { width: 70, height: 70 },
});