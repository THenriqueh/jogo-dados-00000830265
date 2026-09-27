import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Dado from './Dado';

const TOTAL_RODADAS = 5;
const FUNDO = '#f2f2f2';

function rolarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

type Resultado = 'Ganhou' | 'Perdeu' | 'Empatou';

export default function JogoDados() {
  const [rodada, setRodada] = useState(1);
  const [vez, setVez] = useState<'A' | 'B'>('A');
  const [dadosA, setDadosA] = useState<[number, number]>([1, 1]);
  const [dadosB, setDadosB] = useState<[number, number]>([1, 1]);
  const [resultadoRodada, setResultadoRodada] = useState<{ a: Resultado; b: Resultado } | null>(null);
  const [placar, setPlacar] = useState({ a: 0, b: 0, empates: 0 });
  const [jogoFinalizado, setJogoFinalizado] = useState(false);

  function jogarA() {
    setDadosA([rolarDado(), rolarDado()]);
    setVez('B');
  }

  function jogarB() {
    const novoDadosB: [number, number] = [rolarDado(), rolarDado()];
    setDadosB(novoDadosB);
    const somaA = dadosA[0] + dadosA[1];
    const somaB = novoDadosB[0] + novoDadosB[1];

    let resultado: { a: Resultado; b: Resultado };
    if (somaA > somaB) {
      resultado = { a: 'Ganhou', b: 'Perdeu' };
      setPlacar((p) => ({ ...p, a: p.a + 1 }));
    } else if (somaB > somaA) {
      resultado = { a: 'Perdeu', b: 'Ganhou' };
      setPlacar((p) => ({ ...p, b: p.b + 1 }));
    } else {
      resultado = { a: 'Empatou', b: 'Empatou' };
      setPlacar((p) => ({ ...p, empates: p.empates + 1 }));
    }
    setResultadoRodada(resultado);
    setVez('A');

    setTimeout(() => {
      if (rodada === TOTAL_RODADAS) {
        setJogoFinalizado(true);
      } else {
        setRodada((r) => r + 1);
        setResultadoRodada(null);
      }
    }, 1500);
  }

  function jogarNovamente() {
    setRodada(1);
    setVez('A');
    setDadosA([1, 1]);
    setDadosB([1, 1]);
    setResultadoRodada(null);
    setPlacar({ a: 0, b: 0, empates: 0 });
    setJogoFinalizado(false);
  }

  const aguardando = resultadoRodada !== null; // trava os botões enquanto mostra o resultado

  if (jogoFinalizado) {
    let mensagemFinal: string;
    if (placar.a > placar.b) mensagemFinal = 'Jogador A venceu a partida!';
    else if (placar.b > placar.a) mensagemFinal = 'Jogador B venceu a partida!';
    else mensagemFinal = 'A partida terminou empatada!';

    return (
      <View style={styles.tela}>
        <View style={styles.card}>
          <View style={styles.tituloWrapper}>
            <Text style={styles.titulo}>Fim de Jogo</Text>
          </View>
          <Text style={styles.mensagemFinal}>{mensagemFinal}</Text>
          <Text style={styles.placar}>
            Placar: A {placar.a} x {placar.b} B  ·  {placar.empates} empate(s)
          </Text>
          <Pressable style={styles.botao} onPress={jogarNovamente}>
            <Text style={styles.botaoTexto}>Jogar Novamente</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <View style={styles.card}>
        <View style={styles.tituloWrapper}>
          <Text style={styles.titulo}>Rodada {rodada}</Text>
        </View>

        <View style={styles.jogadores}>
          <View style={styles.jogador}>
            <View style={styles.dados}>
              <Dado valor={dadosA[0]} />
              <Dado valor={dadosA[1]} />
            </View>
            <Text style={styles.resultado}>
              {resultadoRodada ? `Jogador A ${resultadoRodada.a}` : 'Jogador A'}
            </Text>
            <Pressable
              style={[styles.botao, (vez !== 'A' || aguardando) && styles.botaoDesabilitado]}
              onPress={jogarA}
              disabled={vez !== 'A' || aguardando}
            >
              <Text style={styles.botaoTexto}>Jogar Dado</Text>
            </Pressable>
          </View>

          <View style={styles.jogador}>
            <View style={styles.dados}>
              <Dado valor={dadosB[0]} />
              <Dado valor={dadosB[1]} />
            </View>
            <Text style={styles.resultado}>
              {resultadoRodada ? `Jogador B ${resultadoRodada.b}` : 'Jogador B'}
            </Text>
            <Pressable
              style={[styles.botao, (vez !== 'B' || aguardando) && styles.botaoDesabilitado]}
              onPress={jogarB}
              disabled={vez !== 'B' || aguardando}
            >
              <Text style={styles.botaoTexto}>Jogar Dado</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: FUNDO, justifyContent: 'center', padding: 16 },
  card: {
    borderWidth: 1.5,
    borderColor: '#222',
    borderRadius: 20,
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 20,
  },
  tituloWrapper: {
    position: 'absolute',
    top: -22,
    alignSelf: 'center',
    backgroundColor: FUNDO,
    paddingHorizontal: 14,
  },
  titulo: { fontSize: 30, fontWeight: 'bold' },
  jogadores: { flexDirection: 'row', width: '100%' },
  jogador: { flex: 1, alignItems: 'center', gap: 16 },
  dados: { flexDirection: 'row', gap: 8 },
  resultado: { fontSize: 17, fontWeight: '600' },
  botao: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 30,
  },
  botaoDesabilitado: { backgroundColor: '#bbb' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  mensagemFinal: { fontSize: 22, fontWeight: '600', textAlign: 'center' },
  placar: { fontSize: 15, color: '#444' },
});