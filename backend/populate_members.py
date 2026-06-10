"""
Script para popular o banco de dados com membros do ministério de louvor
Dados extraídos da planilha fornecida
"""

import bcrypt
import os
import sys

# Adiciona o diretório pai ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from database.db import db
    from models.user import User
    from app import app
except ImportError:
    print("Erro ao importar módulos. Certifique-se de rodar o script dentro da pasta backend.")
    sys.exit(1)

# Dados dos membros extraídos da planilha
MEMBERS_DATA = [
    {"name": "BRUNA", "voice": "Mezzo-soprano", "function": "Líder de Adoração", "secondary": "Backing Vocal", "email": "brunarrocha@gmail.com", "birth_date": "20/05/1990", "notes": None},
    {"name": "CLAUDIA", "voice": "Contralto", "function": "Líder de Adoração", "secondary": "Backing Vocal", "email": "claudialismann@gmail.com", "birth_date": "14/05/1990", "notes": None},
    {"name": "HELOSMAN", "voice": "Baritono", "function": "Líder de Adoração", "secondary": "Backing Vocal", "email": "helosman.un@gmail.com", "birth_date": "04/12/1986", "notes": None},
    {"name": "PR. BRENO", "voice": "Tenor / Bateria", "function": "Líder de Adoração", "secondary": "Instrumental", "email": "brenoo.maia@gmail.com", "birth_date": "28/02/1985", "notes": None},
    {"name": "PRA. SARAH", "voice": "Mezzo-soprano", "function": "Líder de Adoração", "secondary": "Backing Vocal", "email": "sarinhadoradora@gmail.com", "birth_date": "06/01/2024", "notes": None},
    {"name": "PRI", "voice": "Soprano", "function": "Líder de Adoração", "secondary": "Backing Vocal", "email": "pricampos.r@gmail.com", "birth_date": "14/06/1992", "notes": None},
    {"name": "TATI", "voice": "Contralto", "function": "Líder de Adoração", "secondary": "Backing Vocal", "email": "tatianemlima@gmail.com", "birth_date": "06/07/1992", "notes": None},
    {"name": "THIAGO A", "voice": "Tenor", "function": "Líder de Adoração", "secondary": "Backing Vocal", "email": "thiagoazevedo92@gmail.com", "birth_date": "04/11/1992", "notes": None},
    {"name": "VALESKA", "voice": "Mezzo-soprano", "function": "Líder de Adoração", "secondary": "Backing Vocal", "email": "familiaalmeidagarc626@gmail.com", "birth_date": "25/05/1978", "notes": None},
    {"name": "ISAIAS", "voice": "Tenor / Teclado", "function": "Líder de Adoração", "secondary": "Instrumental / Backing", "email": "osaiasbarbieiro@gmail.com", "birth_date": "27/07/1995", "notes": None},
    {"name": "HELEN", "voice": "Mezzo-soprano", "function": "Líder de Adoração", "secondary": "Backing Vocal", "email": None, "birth_date": None, "notes": "Líder de time de louvor jovens"},
    {"name": "BEATRIZ", "voice": "Mezzo-soprano", "function": "Líder de Adoração", "secondary": "Backing Vocal", "email": "balmeida82282@gmail.com", "birth_date": "23/03/2009", "notes": "Líder de time de louvor jovens"},
    {"name": "FABIANO", "voice": "Baritono", "function": "Backing Vocal", "secondary": "Backing Vocal", "email": "fabianoromenolima@gmail.com", "birth_date": None, "notes": "#N/A"},
    {"name": "JULIANA", "voice": "Mezzo-soprano", "function": "Backing Vocal", "secondary": "Backing Vocal", "email": "juliianamagalhaes95@gmail.com", "birth_date": "22/05/1993", "notes": None},
    {"name": "SANDRO", "voice": "Baritono", "function": "Backing Vocal", "secondary": "Backing Vocal", "email": "sandrochiarel@gmail.com", "birth_date": "19/11/1974", "notes": "Brevemente no teclado"},
    {"name": "SHEILA", "voice": "Contralto", "function": "Backing Vocal", "secondary": "Backing Vocal", "email": "sheillachiarel@gmail.com", "birth_date": None, "notes": "#NAME?"},
    {"name": "SONINHA", "voice": "Contralto", "function": "Backing Vocal", "secondary": "Backing Vocal", "email": "soniaisabel.sedf@gmail.com", "birth_date": "29/12/1969", "notes": None},
    {"name": "VANESSA", "voice": "Contralto", "function": "Backing Vocal", "secondary": "Backing Vocal", "email": "vanessasantoslacerda@hotmail.com", "birth_date": None, "notes": None},
    {"name": "AMANDA", "voice": "Soprano", "function": "Backing Vocal", "secondary": "Líder de Adoração", "email": "amandarbeiroporto@gmail.com", "birth_date": "26/05/1993", "notes": "Liderando período de sala de oração"},
    {"name": "JOYCE", "voice": "Contralto", "function": "Backing Vocal", "secondary": "Backing Vocal", "email": "joycemorais.v@gmail.com", "birth_date": "21/12/1994", "notes": None},
    {"name": "RENATA", "voice": "Contralto", "function": "Backing Vocal", "secondary": "Backing Vocal", "email": "renataeudetuolo@gmail.com", "birth_date": "16/10/1987", "notes": "Iniciando"},
    {"name": "DAVIDSON", "voice": "Baixo", "function": "Instrumental", "secondary": "Instrumental", "email": "davdsonc@gmail.com", "birth_date": "22/10/1991", "notes": None},
    {"name": "GADIEL", "voice": "Guitarra / Teclado", "function": "Instrumental", "secondary": "Instrumental", "email": "gadielbarbosalima@gmail.com", "birth_date": "03/02/1990", "notes": None},
    {"name": "PR. LAERCIO", "voice": "Teclado / Baixo / Violão", "function": "Instrumental", "secondary": "Instrumental", "email": "laercioestevan@gmail.com", "birth_date": None, "notes": "#N/A"},
    {"name": "THOMAS", "voice": "Baixo", "function": "Instrumental", "secondary": "Instrumental", "email": "thomasgt77@gmail.com", "birth_date": "21/02/1989", "notes": None},
    {"name": "VINICIUS", "voice": "Bateria / Teclado", "function": "Instrumental", "secondary": "Instrumental", "email": "vinislves.100@gmail.com", "birth_date": "31/01/2009", "notes": "Líder de time de louvor jovens"},
    {"name": "ADRIEL", "voice": "Bateria", "function": "Instrumental", "secondary": "Instrumental", "email": "adrielsorriso@hotmail.com", "birth_date": None, "notes": "DEZ"},
    {"name": "VICTOR CHIAREL", "voice": "Bateria", "function": "Instrumental", "secondary": "Instrumental", "email": None, "birth_date": None, "notes": "Bateria - culto de jovens e homens"},
    {"name": "CAROL", "voice": "Violão", "function": "Instrumental", "secondary": "Instrumental", "email": None, "birth_date": None, "notes": "Violão - culto de jovens"},
    {"name": "RAUL", "voice": "Bateria", "function": "Instrumental", "secondary": "Instrumental", "email": "raulkairos@gmail.com", "birth_date": "25/03/1989", "notes": None},
    {"name": "URY", "voice": "Baixo", "function": "Instrumental", "secondary": "Instrumental", "email": "contatoury1@gmail.com", "birth_date": None, "notes": "#N/A"},
    {"name": "CLAYTON", "voice": "Guitarra", "function": "Instrumental", "secondary": "Instrumental", "email": "clayton512.96@gmail.com", "birth_date": "09/06/1996", "notes": None},
    {"name": "GUSTAVO", "voice": "Teclado / Baixo / Guitarra", "function": "Instrumental", "secondary": "Instrumental", "email": "gustadev07@gmail.com", "birth_date": "03/03/2006", "notes": "Iniciado nos jovens"},
    {"name": "LUIS GUSTAVO", "voice": "Teclado / Violão / Guitarra / Baixo", "function": "Instrumental", "secondary": "Líder de Adoração/Backing Vocal", "email": "luisgustavosolourior@gmail.com", "birth_date": "14/07/1997", "notes": "Iniciar no apoio em junho"},
    {"name": "XBEN", "voice": "Teclado", "function": "Instrumental", "secondary": "Backing Vocal", "email": "xbenhelton.com@gmail.com", "birth_date": "27/03/2006", "notes": "Iniciado nos jovens"},
    {"name": "LAIS", "voice": "Bateria / Violão", "function": "Instrumental", "secondary": "Instrumental", "email": "laisfemandav07@gmail.com", "birth_date": "07/11/2004", "notes": "Iniciado nos jovens"},
    {"name": "LUIDI", "voice": "Violão", "function": "Líder de Adoração", "secondary": "Violão", "email": None, "birth_date": None, "notes": "BREVE - Liderando períodos de sala de oração"},
    {"name": "THIAGO XAVIER", "voice": "Baritono", "function": "Backing Vocal", "secondary": "Backing Vocal", "email": "thiagoxavier21@gmail.com", "birth_date": None, "notes": "#N/A INDETERMINADO"},
    {"name": "ALESSANDRA", "voice": "Violão / Teclado", "function": "Instrumental", "secondary": "Instrumental", "email": "alessandra27gac@gmail.com", "birth_date": None, "notes": "#N/A RECEM NASCIDO"},
    {"name": "JOTAPE", "voice": "Guitarra", "function": "Instrumental", "secondary": "Instrumental", "email": "jpruil@gmail.com", "birth_date": None, "notes": "#N/A INDETERMINADO"},
]

def populate_members():
    """Adiciona todos os membros ao banco de dados"""
    with app.app_context():
        # Limpar usuários existentes (opcional)
        print("Iniciando população de membros...")
        
        # Senha padrão para todos
        default_password = "louvor2024"
        password_hash = bcrypt.hashpw(default_password.encode(), bcrypt.gensalt()).decode()
        
        added_count = 0
        skipped_count = 0
        
        for member_data in MEMBERS_DATA:
            try:
                # Verificar se já existe
                existing = User.query.filter_by(email=member_data.get("email")).first() if member_data.get("email") else None
                
                if existing:
                    print(f"[SKIP] Pulando {member_data['name']} (email já existe)")
                    skipped_count += 1
                    continue
                
                # Criar usuário
                user = User(
                    full_name=member_data["name"],
                    email=member_data.get("email"),
                    password=password_hash,
                    voice=member_data.get("voice"),
                    birth_date=member_data.get("birth_date"),
                    notes=member_data.get("notes"),
                    role="member",
                    status="Apto"
                )
                
                db.session.add(user)
                print(f"[OK] Adicionado: {member_data['name']} ({member_data['voice']})")
                added_count += 1
                
            except Exception as e:
                print(f"[ERR] Erro ao adicionar {member_data['name']}: {str(e)}")
                skipped_count += 1
        
        # Commit
        db.session.commit()
        
        print("\n" + "="*60)
        print(f"[OK] Membros adicionados: {added_count}")
        print(f"[SKIP] Membros pulados: {skipped_count}")
        print(f"[TOTAL] Total de membros no banco: {User.query.count()}")
        print("="*60)

if __name__ == "__main__":
    populate_members()
