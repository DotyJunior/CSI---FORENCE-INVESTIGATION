import { Case } from './types';

export const casesData: Case[] = [
  {
    id: '001',
    title: 'Caso #001: Reduto Clandestino',
    description: 'Um corpo é encontrado nos fundos de um antigo galpão industrial que funcionava como laboratório químico de drogas sintéticas em Miami. O maquinário principal ainda exala calor e os traços são frescos.',
    difficulty: 'Fácil',
    rewardXp: 150,
    rewardCredits: 100,
    sceneImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop', // Lab aesthetic
    storyline: 'Você chega à cena cercada por fitas de isolamento amarelas. O odor de ácido é forte. Sua missão é escanear a cena para encontrar as três principais classes de evidências: Biológica, Balística e Digital antes que as pistas se deteriorem.',
    scenePrompt: 'Um laboratório industrial escuro com iluminação verde ciano florescente, mesas de aço inoxidável com beckers químicos, fios pendurados e fitas de isolamento amarelas de cena do crime.',
    hotspots: [
      {
        id: 'clue-1-bio',
        name: 'Resíduos Orgânicos',
        category: 'Biológica',
        x: 42,
        y: 65,
        radius: 6,
        clueKey: 'hair_sample',
        clueTitle: 'Fio de Cabelo Castanho',
        clueDesc: 'Um fio de cabelo humano de cor castanha escura encravado na carcaça metálica do reator químico principal. Ideal para extração de folículo de DNA.'
      },
      {
        id: 'clue-1-bal',
        name: 'Impacto de Projétil',
        category: 'Balística',
        x: 78,
        y: 35,
        radius: 6,
        clueKey: 'bullet_case',
        clueTitle: 'Projétil .38 Amassado',
        clueDesc: 'Um projétil de liga de chumbo deformado incrustado na chapa de drywall a 1.6m de altura. Apresenta marcas de raiamento estriado da arma de fogo disparada.'
      },
      {
        id: 'clue-1-dig',
        name: 'Mídia Descartada',
        category: 'Digital',
        x: 23,
        y: 80,
        radius: 6,
        clueKey: 'usb_pendrive',
        clueTitle: 'Pen Drive Criptografado',
        clueDesc: 'Um dispositivo USB de estrutura metálica encontrado sob uma pilha de caixas de papelão úmidas. Aparentemente contém registros de lote negociados.'
      }
    ],
    suspects: [
      {
        id: 's-vance',
        name: 'Dr. Arthur Vance',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop',
        role: 'Químico Renegado',
        motive: 'Teve seu registro cassado por conduta experimental e precisava de financiamento secreto.',
        dnaMatch: 98,
        digitalMatch: 82,
        ballisticMatch: 20,
        alibiScore: -15,
        description: 'Ex-professor universitário com histórico de insubordinação. Suas digitais coincidem com o registro e o DNA recolhido no reator químico bate quase 100% com sua ficha genética.',
        guilty: true
      },
      {
        id: 's-helena',
        name: 'Helena Rios',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
        role: 'Proprietária do Galpão',
        motive: 'Recebia suborno volumoso para ignorar a atividade criminosa em seu estabelecimento comercial.',
        dnaMatch: 12,
        digitalMatch: 95,
        ballisticMatch: 5,
        alibiScore: -40,
        description: 'Empresária do ramo imobiliário de luxo. Embora as transações digitais do pen drive a interliguem ao aluguel clandestino com lucros ocultos, ela não estava na cena na hora do homicídio.',
        guilty: false
      }
    ],
    conclusionNote: 'Excelente trabalho, Perito! O Dr. Vance confessou ter disparado contra o seu investidor após uma discussão sobre a pureza das misturas químicas. Seu nome agora sobe na agência de Miami!'
  },
  {
    id: '002',
    title: 'Caso #002: Assinatura de Chumbo',
    description: 'Um segurança de uma transportadora de suprimentos médicos é baleado num beco traseiro do cais de Miami durante uma entrega tática de insumos sob sigilo.',
    difficulty: 'Médio',
    rewardXp: 250,
    rewardCredits: 180,
    sceneImage: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=1200&auto=format&fit=crop', // Alleyway / port
    storyline: 'A análise preliminar indica que a arma de fogo disparada possui exatamente o mesmo perfil tático e estrías de cano encontradas no Caso #001! Alguém de peso distribuiu aquela arma ou o assassino tático faz parte do mesmo Sindicato Neon.',
    scenePrompt: 'Um cais portuário úmido durante a noite, com luzes azul ciano de guindastes distantes, caixas de contêineres e poças metálicas com reflexo de neon roxo nas superfícies industriais.',
    hotspots: [
      {
        id: 'clue-2-bal',
        name: 'Munição Deixada',
        category: 'Balística',
        x: 50,
        y: 85,
        radius: 7,
        clueKey: 'casing_38',
        clueTitle: 'Estojo .38 Customizado',
        clueDesc: 'Um estojo de munição de bronze com gravação manual tática na base traseira. O padrão de percussão aponta para a arma apreendida hipoteticamente.'
      },
      {
        id: 'clue-2-bio',
        name: 'Mancha Orgânica',
        category: 'Biológica',
        x: 35,
        y: 50,
        radius: 6,
        clueKey: 'blood_splash',
        clueTitle: 'Respingo de Sangue AB-',
        clueDesc: 'Pequenas gotas projetadas contra a lona impermeável do caminhão de entregas. Pertence ao atirador que se feriu na disputa física rápida com o guarda.'
      },
      {
        id: 'clue-2-dig',
        name: 'Terminal de GPS',
        category: 'Digital',
        x: 74,
        y: 30,
        radius: 6,
        clueKey: 'tablet_gps',
        clueTitle: 'Roteador GPS da Van',
        clueDesc: 'Dispositivo eletrônico do painel da transportadora corrompido propositalmente, mas com backups de coordenadas para uma Marina privada de alto padrão.'
      }
    ],
    suspects: [
      {
        id: 's-grizzly',
        name: 'Marcus "Grizzly" Thorne',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        role: 'Guarda Voluntário / Segurança',
        motive: 'Trabalhava de infiltrado para o Sindicato e roubou o carregamento biológico para repassar a intermediários.',
        dnaMatch: 99,
        digitalMatch: 35,
        ballisticMatch: 95,
        alibiScore: -10,
        description: 'Ex-militar demitido por insubordinação. O sangue tipo raro AB- encontrado na cena e o projétil tático disparado de seu revólver tático de cano customizado o colocam no topo da responsabilidade do disparo.',
        guilty: true
      },
      {
        id: 's-julian',
        name: 'Julian Vance',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
        role: 'Irmão do Dr. Arthur',
        motive: 'Tentar livrar e financiar a fuga do irmão provendo fundos através do contrabando do material farmacêutico.',
        dnaMatch: 38,
        digitalMatch: 92,
        ballisticMatch: 15,
        alibiScore: -60,
        description: 'Investigado pelo sistema financeiro por transações internacionais, as coordenadas de GPS mostram que ele comprou barcos na marina, mas não há conexão física dele disparando no cais.',
        guilty: false
      }
    ],
    conclusionNote: 'Fabuloso, detetive! Marcus Thorne confessou que agia como braço armado de uma organização de Miami que opera sob fachadas na Marina de Luxo: o temível "Sindicato Neon". O caso esquenta!'
  },
  {
    id: '003',
    title: 'Caso #003: Cripta da Marina',
    description: 'Invasão, roubo e queima de arquivos na luxuosa Marina de Miami. O gerente administrativo foi asfixiado e um escritório flutuante foi revirado em busca de discos criptográficos.',
    difficulty: 'Médio',
    rewardXp: 350,
    rewardCredits: 250,
    sceneImage: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1200&auto=format&fit=crop', // Marina dock midnight
    storyline: 'Estaríamos diante de uma limpeza tática feita pelo Sindicato Neon? Helena Rios (suspeita do Caso #001) possui forte influência neste local. O notebook principal do gerente foi sabotado com ácido, restando-nos buscar pistas no cais e celulares sob a água.',
    scenePrompt: 'Uma marina de iates de luxo sob céu estrelado escuro, decks de madeira iluminados por fitas de LED magenta neon, reflexos na água negra e silhuetas de iates imponentes.',
    hotspots: [
      {
        id: 'clue-3-dig',
        name: 'Mídia Submersa',
        category: 'Digital',
        x: 25,
        y: 65,
        radius: 7,
        clueKey: 'cellphone_water',
        clueTitle: 'Smartphone de Helena Rios',
        clueDesc: 'Um celular à prova d’água recuperado do fundo da marina por mergulhadores táticos. Contém áudios deletados ordenando descarte rápido de provas quentes.'
      },
      {
        id: 'clue-3-bio',
        name: 'Copos de Vidro',
        category: 'Biológica',
        x: 60,
        y: 45,
        radius: 5,
        clueKey: 'saliva_glass',
        clueTitle: 'Saliva em Copo de Cristal',
        clueDesc: 'Vestígios de resíduo de batom e saliva recolhidos em um copo de bebida vazio deixado sob o balcão privado de Helena Rios no convés principal do iate.'
      },
      {
        id: 'clue-3-bal',
        name: 'Suporte de Arma',
        category: 'Balística',
        x: 82,
        y: 75,
        radius: 6,
        clueKey: 'silencer_found',
        clueTitle: 'Silenciador com Resíduos',
        clueDesc: 'Dispositivo rosqueável amortecedor de ruído descartado em cesto de lixo. Os resíduos de pólvora combinam perfeitamente com a composição das ligas do Caso #002.'
      }
    ],
    suspects: [
      {
        id: 's-helena-003',
        name: 'Helena Rios',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
        role: 'Investidora e Membro do Sindicato',
        motive: 'Eliminar o gerente que estava cooperando sigilosamente com nossa equipe e planejando delação premiada.',
        dnaMatch: 99,
        digitalMatch: 100,
        ballisticMatch: 75,
        alibiScore: -5,
        description: 'Desta vez, sem álibis blindados. A análise da saliva de Helena no copo de bebidas privado e suas trocas de texto táticas no celular submerso não deixam dúvidas: ela estava liderando a eliminação pessoalmente.',
        guilty: true
      },
      {
        id: 's-julian-003',
        name: 'Julian Vance',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
        role: 'Consultor Financeiro',
        motive: 'Prover ferramentas de evasão de divisas internacionais para o alto escalão do Sindicato.',
        dnaMatch: 11,
        digitalMatch: 85,
        ballisticMatch: 12,
        alibiScore: -55,
        description: 'Julian estava em Nova York assinando contratos comerciais legítimos, embora seus registros financeiros indicassem depósitos maciços oriundos de contas indicadas por Helena.',
        guilty: false
      }
    ],
    conclusionNote: 'Fantástico, Investigador Chefe! Rios pensava que sua fortuna a protegeria, mas as provas genéticas e de áudio forense a guiaram direto ao isolamento penitenciário. As pistas do celular dela apontam para uma ramificação em Nova York!'
  },
  {
    id: '004',
    title: 'Caso #004: Conexão Nova York',
    description: 'Um talentoso especialista em segurança digital que tentou escapar do Sindicato Neon é encontrado morto em frente a monitores múltiplos em uma cobertura de alto luxo em Manhattan.',
    difficulty: 'Difícil',
    rewardXp: 500,
    rewardCredits: 400,
    sceneImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop', // Tech loft
    storyline: 'Os servidores locais foram formatados remotamente sob o protocolo de autodestruição cibernética, restando apenas frações de dados no disco rígido físico e vestígios balísticos raros deixados pelo executor enviado do Sindicato.',
    scenePrompt: 'Uma cobertura tecnológica com vista de arranha-céus noturnos de Nova York através de janelas gigantescas, muitas telas acesos em azul ciano e vermelho, mesa minimalist de vidro e fitas amarelas de evidência criminal.',
    hotspots: [
      {
        id: 'clue-4-dig',
        name: 'Armazenamento Forçado',
        category: 'Digital',
        x: 35,
        y: 42,
        radius: 6,
        clueKey: 'hdd_shattered',
        clueTitle: 'HD Físico Semi-Destruído',
        clueDesc: 'Unidade SSD que sofreu impacto mecânico mas resistiu com blocos de memória intactos. Contém planilhas de lavagem ligadas ao gabinete de um senador influente.'
      },
      {
        id: 'clue-4-bal',
        name: 'Cápsula Escondida',
        category: 'Balística',
        x: 68,
        y: 78,
        radius: 6,
        clueKey: 'bullet_9mm',
        clueTitle: 'Cápsula 9mm de Precisão',
        clueDesc: 'Uma munição especial altamente polida de calibre 9.19mm com padrão cirúrgico de disparador de luneta, incomum no mercado civil norte-americano.'
      },
      {
        id: 'clue-4-bio',
        name: 'Rasgo de Proteção',
        category: 'Biológica',
        x: 52,
        y: 60,
        radius: 5,
        clueKey: 'glove_scrap',
        clueTitle: 'Pedacinho de Látex Rasgado',
        clueDesc: 'Fragmento de luva descartável pego em um parafuso afiado sob a mesa do hacker. Reteve suor e material biológico essenciais para mapear o perfil metabólico do suspeito.'
      }
    ],
    suspects: [
      {
        id: 's-dmitri',
        name: 'Dmitri Volkov',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
        role: 'Operador e Executor do Sindicato',
        motive: 'Apagar todos os dados financeiros que interligam o financiamento eleitoral do Sindicato com as contas internacionais.',
        dnaMatch: 97,
        digitalMatch: 99,
        ballisticMatch: 98,
        alibiScore: -12,
        description: 'Ex-agente de contrainteligência russo atuando como solucionador de elite em solo americano. O DNA da luva rasgada e as marcas de compressão de disparo em seu revólver de precisão são irrebatíveis.',
        guilty: true
      },
      {
        id: 's-clara',
        name: 'Dra. Clara Sand',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        role: 'Arquiteta de Sistemas Civis',
        motive: 'Projetou a malha de segurança física do edifício comercial a mando dos proprietários.',
        dnaMatch: 5,
        digitalMatch: 40,
        ballisticMatch: 0,
        alibiScore: -88,
        description: 'Estava palestrando em um comitê municipal sobre segurança urbana. Nenhuma evidência biológica ou material a liga à ação criminosa no quarto de luxo.',
        guilty: false
      }
    ],
    conclusionNote: 'Incrível trabalho de dedução forense! Dmitri foi neutralizado antes de fugir para a Europa Oriental. Suas finanças criptográficas revelam o cabeça da conspiração: o Senador Victor Sterling!'
  },
  {
    id: '005',
    title: 'Caso #005: Conspiração Suprema',
    description: 'A cartada final. Uma batida urgente e perigosa no escritório privado do luxuoso bunker urbano do Senador Victor Sterling para confiscar as chaves de acesso governamentais.',
    difficulty: 'Crítico',
    rewardXp: 1000,
    rewardCredits: 750,
    sceneImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop', // Bunker/mansion office
    storyline: 'O Senador nega enfaticamente qualquer envolvimento e alega perseguição tática. No entanto, sua secretária acaba de relatar que ele trancou-se na sala acionando o protocolo de queima térmica. Você tem poucos minutos para obter as pistas indiscutíveis e efetuar a acusação federal.',
    scenePrompt: 'Um escritório de alto padrão governamental com painéis de madeira escura combinados com servidores em rack, hologramas azul ciano de dados, cinzeiros clássicos e fita de isolamento amarela tática na entrada.',
    hotspots: [
      {
        id: 'clue-5-dig',
        name: 'Mainframe Federal',
        category: 'Digital',
        x: 75,
        y: 48,
        radius: 7,
        clueKey: 'senator_server',
        clueTitle: 'Servidor Secreto Sterling',
        clueDesc: 'Módulo de chaves criptográficas governamentais contendo transferências federais diretas para os barcos de Helena Rios e o laboratório clandestino.'
      },
      {
        id: 'clue-5-bal',
        name: 'Esconderijo Armas',
        category: 'Balística',
        x: 28,
        y: 35,
        radius: 6,
        clueKey: 'sterling_pistol',
        clueTitle: 'Pistola Gravada Sterling',
        clueDesc: 'Pistola calibre 9.19mm banhada a platina com número de série parcialmente corroído com ácido nítrico, combinando mecanicamente com a arma do crime do Caso #004.'
      },
      {
        id: 'clue-5-bio',
        name: 'Máscara de Proteção',
        category: 'Biológica',
        x: 48,
        y: 78,
        radius: 6,
        clueKey: 'gas_mask_hairs',
        clueTitle: 'Máscara de Gás com Saliva',
        clueDesc: 'Filtro descartável de máscara utilizado durante o início da queima tática térmica forense. Possui vestígios epiteliais combinando com o DNA do senador.'
      }
    ],
    suspects: [
      {
        id: 's-sterling',
        name: 'Senador Victor Sterling',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
        role: 'Membro do Senado e Mentor do Sindicato',
        motive: 'Instaurar um império financeiro sob imunidade parlamentar explorando cartéis químicos e cibernéticos.',
        dnaMatch: 100,
        digitalMatch: 100,
        ballisticMatch: 99,
        alibiScore: 0,
        description: 'Mentor máximo por trás das operações comerciais de contrabando, lavagem e execuções silenciadoras em Miami e NY. As evidências genéticas colhidas em seu filtro de emergência e a chave criptográfica master de seu terminal isolado põem fim ao seu álibi tático.',
        guilty: true
      },
      {
        id: 's-clara-005',
        name: 'Dra. Clara Sand',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        role: 'Consultora de Software',
        motive: 'Desenvolver algoritmos de inteligência de criptografia para servidores locais.',
        dnaMatch: 8,
        digitalMatch: 52,
        ballisticMatch: 0,
        alibiScore: -95,
        description: 'Apesar de ter prestado consultorias legítimas contratadas para a prefeitura, as chaves de acesso eram manipuladas exclusivamente por Sterling e seus generais em Miami.',
        guilty: false
      }
    ],
    conclusionNote: 'Espetacular! A conspiração foi internacionalmente desmantelada. O Senador Victor Sterling foi destituído e preso por traição, lavagem de capitais e homicídio tático continuado. Perito Criminal Lendário, você fez história!'
  }
];
