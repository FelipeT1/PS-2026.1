from pathlib import Path
import re

pasta = Path("/home/sylvio/Downloads/furto/")

for arquivo in pasta.iterdir():
    if arquivo.is_file():
        match = re.search(r"\((\d+)\)", arquivo.stem)

        if match:
            numero = match.group(1)
            novo_nome = f"{numero}{arquivo.suffix}"

            novo_caminho = arquivo.with_name(novo_nome)

            arquivo.rename(novo_caminho)

            print(f"{arquivo.name} -> {novo_nome}")
