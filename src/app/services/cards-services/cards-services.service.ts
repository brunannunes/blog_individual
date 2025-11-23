import { Injectable } from '@angular/core';
import { ServiceModel } from '../../models/ServiceModel';

@Injectable({
  providedIn: 'root'
})
export class CardsServicesService {

  constructor() { }

  get_services(): ServiceModel[] {
    return [
      {
        id: 1,
        title: 'Cotação do Dólar',
        short_description: 'Acompanhe a cotação do dólar em tempo real.',
        image_url: 'assets/cotacao_112020.html',
        code_url: `"""
                  Cotação do Dólar – Novembro/2020 -> Gráfico de linha com Plotly
                  """

                  import calendar
                  from datetime import datetime

                  import pandas as pd
                  import plotly.express as px
                  import requests


                  # FUNÇÕES DE CONSULTA AO BANCO CENTRAL

                  def consultar_cotacao_ptax(periodo_inicio, periodo_fim):
                      """
                      Consulta o Banco Central (PTAX) para o período informado.

                      """

                      # formato MM-DD-YYYY
                      data_inicio_str = periodo_inicio.strftime("%m-%d-%Y")
                      data_fim_str = periodo_fim.strftime("%m-%d-%Y")

                      url = (
                          "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/"
                          "CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)"
                          f"?@dataInicial='{data_inicio_str}'&@dataFinalCotacao='{data_fim_str}'"
                          "&$top=10000&$format=json"
                      )

                      resposta = requests.get(url, timeout=15)
                      if resposta.status_code != 200:
                          raise RuntimeError("Falha na requisição à API do Banco Central.")

                      dados_json = resposta.json()
                      if "value" not in dados_json or len(dados_json["value"]) == 0:
                          raise RuntimeError("Nenhuma cotação encontrada no período especificado.")

                      df_cotacoes = pd.DataFrame(dados_json["value"])

                      # Normalizar coluna de data
                      if "dataHoraCotacao" not in df_cotacoes.columns:
                          for col in df_cotacoes.columns:
                              if col.lower().startswith("data") and "cotacao" in col.lower():
                                  df_cotacoes = df_cotacoes.rename(columns={col: "dataHoraCotacao"})
                                  break

                      df_cotacoes["dataHoraCotacao"] = pd.to_datetime(df_cotacoes["dataHoraCotacao"])
                      return df_cotacoes


                  # FUNÇÃO PRINCIPAL DE PLOTAGEM

                  def gerar_grafico_dolar_novembro_2020(save_html="cotacao_112020.html", mostrar=True):
                      """
                      Gera um gráfico de linha da cotação do dólar para Novembro de 2020.

                      Preenche automaticamente finais de semana e feriados usando o último valor disponível.
                      """

                      # Definir período fixo
                      data_inicio = datetime(2020, 11, 1)
                      data_fim = data_inicio.replace(day=calendar.monthrange(2020, 11)[1])

                      # Consultar dados da API
                      df_cotacoes = consultar_cotacao_ptax(data_inicio, data_fim)

                      # Criar coluna apenas com a data (sem horário)
                      df_cotacoes["data"] = df_cotacoes["dataHoraCotacao"].dt.date

                      # Selecionar colunas de cotação
                      colunas_cotacao = []
                      for col in ("cotacaoCompra", "cotacaoVenda"):
                          if col in df_cotacoes.columns:
                              colunas_cotacao.append(col)
                          else:
                              # tentar correspondência case-insensitive
                              matches = [c for c in df_cotacoes.columns if col.lower() in c.lower()]
                              if matches:
                                  df_cotacoes = df_cotacoes.rename(columns={matches[0]: col})
                                  colunas_cotacao.append(col)

                      if not colunas_cotacao:
                          raise RuntimeError("Nenhuma coluna de cotação encontrada na API.")

                      # Agrupar por dia e pegar último valor disponível do dia
                      df_cotacoes = df_cotacoes.sort_values("dataHoraCotacao")
                      cotacoes_por_dia = df_cotacoes.groupby("data")[colunas_cotacao].last()

                      # Criar índice de datas completo para o mês
                      dias_do_mes = pd.date_range(start=data_inicio.date(), end=data_fim.date(), freq="D")
                      cotacoes_por_dia.index = pd.to_datetime(cotacoes_por_dia.index)
                      cotacoes_por_dia = cotacoes_por_dia.reindex(dias_do_mes)

                      # Preencher finais de semana e feriados com último valor disponível
                      cotacoes_por_dia = cotacoes_por_dia.ffill()

                      # Preparar DataFrame final para Plotly
                      df_plot = cotacoes_por_dia.reset_index().rename(columns={"index": "data"})

                      # Gerar gráfico
                      fig = px.line(
                          df_plot,
                          x="data",
                          y=colunas_cotacao,
                          labels={"value": "Cotação (R$)", "data": "Data"},
                          title="Cotação do Dólar – Novembro/2020"
                      )
                      fig.update_traces(mode="lines+markers")
                      fig.update_xaxes(type="date")

                      if save_html:
                          fig.write_html(save_html)
                          print(f"Gráfico salvo em: {save_html}")

                      if mostrar:
                          fig.show()

                      return fig


                  # EXECUÇÃO AUTOMÁTICA

                  if __name__ == "__main__":
                      gerar_grafico_dolar_novembro_2020()`
      },
      {
        id: 2,
        title: 'Monitoramente de Frota',
        short_description: 'Rastreamento e gestão de veículos em tempo real.',
        image_url: 'assets/frota.html',
        code_url: `import os
                  import requests
                  import folium
                  from dotenv import load_dotenv, find_dotenv

                  # 1) Verificar e carregar o .env
                  find_dotenv() 
                  load_dotenv()
                  print("TOKEN:", repr(os.getenv("SPTRANS_TOKEN")))

                  # 2) Autenticação
                  s = requests.Session()

                  auth = s.post(
                      f"http://api.olhovivo.sptrans.com.br/v2.1/Login/Autenticar?token={os.getenv('SPTRANS_TOKEN')}"
                  )


                  # 3) Buscar paradas da linha

                  codigo_linha = 33377

                  res = s.get(
                      f"http://api.olhovivo.sptrans.com.br/v2.1/Parada/BuscarParadasPorLinha?codigoLinha={codigo_linha}"
                  )

                  paradas = res.json()
                  print(f"Total de paradas encontradas: {len(paradas)}")

                  if len(paradas) == 0:
                      print("Nenhuma parada encontrada")
                      exit()

                  # 4) Criar o mapa

                  m = folium.Map(
                      location=[paradas[0]["py"], paradas[0]["px"]],
                      zoom_start=14
                  )

                  # Paradas – azul
                  for p in paradas:
                      folium.Marker(
                          location=[p["py"], p["px"]],
                          popup=p["np"],
                          icon=folium.Icon(color="blue")
                      ).add_to(m)


                  # 5) Buscar ônibus em tempo real

                  posicao_real = s.get(
                      f"http://api.olhovivo.sptrans.com.br/v2.1/Posicao/Linha?codigoLinha={codigo_linha}"
                  ).json()


                  # 6) Marcar ônibus em vermelho

                  if "vs" in posicao_real and posicao_real["vs"]:
                      print(f"Ônibus encontrados: {len(posicao_real['vs'])}")
                      for v in posicao_real["vs"]:
                          folium.Marker(
                              location=[v["py"], v["px"]],
                              popup=f"Ônibus {v['p']}",
                              icon=folium.Icon(color="red")
                          ).add_to(m)
                  else:
                      print("Nenhum ônibus encontrado no momento.")


                  # 7) Mostrar mapa

                  m.save("frota.html")`
      },
      {
        id: 3,
        title: 'Regressão Linear',
        short_description: 'Análise preditiva usando regressão linear para diversos fins.',
        image_url: 'assets/grafico.html',
        code_url: `from pathlib import Path
                  import os
                  import webbrowser
                  import numpy as np
                  import pandas as pd
                  import plotly.graph_objects as go
                  from plotnine import ggplot, aes, geom_point, geom_abline
                  import sys

                  def read_column_file(path: Path):
                      """Lê um arquivo txt com uma coluna de números e retorna um np.array"""
                      if not path.exists():
                          raise FileNotFoundError(f"Arquivo não encontrado: {path}")
                      
                      vals = []
                      with path.open("r", encoding="utf-8") as f:
                          for line_num, line in enumerate(f, start=1):
                              s = line.strip()
                              if not s:
                                  continue
                              try:
                                  vals.append(float(s))
                              except ValueError:
                                  try:
                                      vals.append(float(s.replace(",", ".")))
                                  except ValueError:
                                      raise ValueError(f"Erro na linha {line_num} de {path}: valor inválido '{s}'")
                      return np.array(vals, dtype=float)

                  def fit_linear_matrix(x: np.ndarray, y: np.ndarray):
                    
                    # 1 cria a matrix de desenho x
                      ones_column = np.ones_like(x)
                      design_matrix = np.column_stack([ones_column, x])  # shape (n,2)

                      # 2️ Calcula X^T X
                      xtx = design_matrix.T @ design_matrix

                      # 3️ Calcula a inversa (ou pseudo-inversa se não for invertível)
                      try:
                          xtx_inv = np.linalg.inv(xtx)
                      except np.linalg.LinAlgError:
                          xtx_inv = np.linalg.pinv(xtx)

                      # 4️ Calcula os coeficientes beta = [a, b]
                      beta = xtx_inv @ design_matrix.T @ y
                      intercept, slope = float(beta[0]), float(beta[1])

                      return intercept, slope


                  def plot_and_save(x: np.ndarray, y: np.ndarray, a: float, b: float, out_png: str = "grafico.png"):
                      """Cria gráfico com pontos, linha de regressão, salva PNG e HTML interativo"""
                      df = pd.DataFrame({"x": x, "y": y})

                      # 1️ Gráfico estático com plotnine
                      try:
                          plot = (
                              ggplot(df, aes("x", "y"))
                              + geom_point()
                              + geom_abline(intercept=a, slope=b)
                          )
                          plot.save(out_png, dpi=150, width=8, height=6)
                          print(f"Gráfico salvo em: {out_png}")
                      except Exception as e:
                          print(f"Erro ao salvar gráfico com plotnine: {e}")

                      # 2️ Gráfico interativo com Plotly
                      try:
                          x_line = np.linspace(df["x"].min(), df["x"].max(), 200)
                          y_line = a + b * x_line

                          fig = go.Figure([
                              go.Scatter(x=df["x"], y=df["y"], mode="markers", name="Observações"),
                              go.Scatter(x=x_line, y=y_line, mode="lines", name=f"Reta: y={a:.4f}+{b:.4f}x")
                          ])

                          fig.update_layout(
                              title=f"Regressão Linear (a={a:.4f}, b={b:.4f})",
                              xaxis_title="X (anos de estudo)",
                              yaxis_title="y (salário)"
                          )

                          out_html = "grafico.html"
                          fig.write_html(out_html, include_plotlyjs="cdn")
                          print(f"Gráfico interativo salvo em: {out_html}")

                          # Tenta abrir no navegador, mas não interrompe se falhar
                          try:
                              webbrowser.open("file://" + os.path.abspath(out_html))
                          except Exception:
                              pass

                      except Exception as e:
                          print(f"Erro ao criar o HTML interativo: {e}")

                  def main():
                      base = Path(__file__).resolve().parent
                      x_path = base / "X.txt"
                      y_path = base / "y.txt"

                      # permite passar caminhos como argumentos
                      if len(sys.argv) >= 3:
                          x_path = Path(sys.argv[1])
                          y_path = Path(sys.argv[2])

                      try:
                          x = read_column_file(x_path)
                          y = read_column_file(y_path)
                      except Exception as e:
                          print(f"Erro ao ler arquivos: {e}")
                          return

                      if x.shape[0] != y.shape[0]:
                          print(f"Tamanhos diferentes: X tem {x.shape[0]} linhas, y tem {y.shape[0]} linhas")
                          return

                      a, b = fit_linear_matrix(x, y)
                      print(f"Coeficientes calculados: a (intercept) = {a}, b (slope) = {b}")

                      plot_and_save(x, y, a, b)

                  if __name__ == "__main__":
                      main()`
    }
    ]
  }
}
