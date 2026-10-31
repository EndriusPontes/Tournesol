
"""Servidor Tournesol*: arquivos estáticos + API de frete.
Uso: python server.py
Acesse: http://localhost:8000/
"""

import json
import math
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs


# Primeiro dígito do CEP -> (região, valor PAC, prazo PAC em dias úteis)
TABELA = {
    0: ("São Paulo (capital)", 22, 5),
    1: ("São Paulo (interior)", 22, 5),
    2: ("RJ / ES", 26, 6),
    3: ("Minas Gerais", 28, 7),
    4: ("BA / SE", 34, 9),
    5: ("Nordeste", 38, 10),
    6: ("Norte", 44, 12),
    7: ("Centro-Oeste", 36, 9),
    8: ("Sul (PR/SC)", 24, 6),
    9: ("Rio Grande do Sul", 26, 7),
}

FRETE_GRATIS = 800


def calcular(cep, subtotal):
    """Calcula as opções de frete com base no CEP e subtotal."""

    regiao, pac, prazo = TABELA[int(cep[0])]

    valor_pac = 0 if subtotal >= FRETE_GRATIS else pac

    return {
        "cep": cep,
        "regiao": regiao,
        "opcoes": [
            {
                "nome": "PAC",
                "valor": valor_pac,
                "prazo": prazo
            },
            {
                "nome": "SEDEX",
                "valor": round(pac * 1.7, 2),
                "prazo": math.ceil(prazo / 2)
            }
        ]
    }


class H(SimpleHTTPRequestHandler):

    def do_GET(self):
        u = urlparse(self.path)

        if u.path == "/api/frete":
            q = parse_qs(u.query)

            cep = "".join(
                c for c in q.get("cep", [""])[0]
                if c.isdigit()
            )

            if len(cep) != 8:
                return self.json(
                    {"erro": "CEP inválido. Informe 8 dígitos."},
                    400
                )

            try:
                subtotal = float(
                    q.get("subtotal", ["0"])[0] or 0
                )

                if not math.isfinite(subtotal) or subtotal < 0:
                    raise ValueError

            except (ValueError, TypeError):
                return self.json(
                    {"erro": "Subtotal inválido."},
                    400
                )

            return self.json(calcular(cep, subtotal))

        return super().do_GET()

    def json(self, dados, status=200):
        resposta = json.dumps(
            dados,
            ensure_ascii=False
        ).encode("utf-8")

        self.send_response(status)
        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8"
        )
        self.send_header(
            "Content-Length",
            str(len(resposta))
        )
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        self.wfile.write(resposta)


if __name__ == "__main__":
    print("Tournesol* rodando em http://localhost:8000")

    servidor = ThreadingHTTPServer(
        ("", 8000),
        H
    )

    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")
        servidor.server_close()
