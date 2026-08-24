import sys
import os
import logging

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.services.graph_service import graph_service
from backend.app.db.schema import init_schema

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("seed_data")

# Curated High-Impact AI/ML Landmark Papers Dataset
CURATED_PAPERS = [
    # 1. Attention & Transformers Core
    {
        "id": "204e3073870fae3d05bcbc2f6a8e263d9b72e776",
        "title": "Attention Is All You Need",
        "year": 2017,
        "venue": "NeurIPS",
        "citationCount": 115000,
        "abstract": "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and relying entirely on an attention mechanism.",
        "tldr": "Introduces the Transformer architecture based solely on self-attention mechanisms without recurrence or convolutions.",
        "url": "https://www.semanticscholar.org/paper/204e3073870fae3d05bcbc2f6a8e263d9b72e776",
        "authors": [
            {"id": "a_vaswani", "name": "Ashish Vaswani"},
            {"id": "a_shazeer", "name": "Noam Shazeer"},
            {"id": "a_parmar", "name": "Niki Parmar"},
            {"id": "a_uszkoreit", "name": "Jakob Uszkoreit"},
            {"id": "a_jones", "name": "Llion Jones"},
            {"id": "a_gomez", "name": "Aidan N. Gomez"},
            {"id": "a_kaiser", "name": "Lukasz Kaiser"},
            {"id": "a_polosukhin", "name": "Illia Polosukhin"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Attention Mechanism", "Deep Learning"],
        "references": ["p_bahdanau_2014", "p_sutskever_2014", "p_vaswani_seq2seq"]
    },
    {
        "id": "p_bahdanau_2014",
        "title": "Neural Machine Translation by Jointly Learning to Align and Translate",
        "year": 2014,
        "venue": "ICLR",
        "citationCount": 35000,
        "abstract": "We introduce an attention mechanism in sequence-to-sequence models allowing the decoder to selectively focus on parts of the source sentence.",
        "tldr": "Introduced the first soft additive attention mechanism for sequence alignment in neural translation.",
        "authors": [
            {"id": "a_bahdanau", "name": "Dzmitry Bahdanau"},
            {"id": "a_cho", "name": "Kyunghyun Cho"},
            {"id": "a_bengio", "name": "Yoshua Bengio"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Attention Mechanism", "Deep Learning"],
        "references": ["p_sutskever_2014", "p_mikolov_word2vec"]
    },
    {
        "id": "p_sutskever_2014",
        "title": "Sequence to Sequence Learning with Neural Networks",
        "year": 2014,
        "venue": "NeurIPS",
        "citationCount": 28000,
        "abstract": "Deep Neural Networks are powerful models. We present a general end-to-end approach to sequence learning that makes minimal assumptions on the sequence structure using multilayered LSTM.",
        "tldr": "Pioneered sequence-to-sequence architecture using multi-layer LSTMs for machine translation.",
        "authors": [
            {"id": "a_sutskever", "name": "Ilya Sutskever"},
            {"id": "a_vinyals", "name": "Oriol Vinyals"},
            {"id": "a_le", "name": "Quoc V. Le"}
        ],
        "fieldsOfStudy": ["Computer Science", "Deep Learning", "Natural Language Processing"],
        "references": ["p_hochreiter_lstm", "p_mikolov_word2vec"]
    },
    {
        "id": "p_hochreiter_lstm",
        "title": "Long Short-Term Memory",
        "year": 1997,
        "venue": "Neural Computation",
        "citationCount": 78000,
        "abstract": "Learning to store information over extended time intervals by recurrent backpropagation takes a very long time. We introduce LSTM with constant error carousels.",
        "tldr": "Seminal paper introducing Long Short-Term Memory recurrent neural networks.",
        "authors": [
            {"id": "a_hochreiter", "name": "Sepp Hochreiter"},
            {"id": "a_schmidhuber", "name": "Jürgen Schmidhuber"}
        ],
        "fieldsOfStudy": ["Computer Science", "Deep Learning", "Recurrent Networks"],
        "references": []
    },
    {
        "id": "p_mikolov_word2vec",
        "title": "Efficient Estimation of Word Representations in Vector Space",
        "year": 2013,
        "venue": "ICLR",
        "citationCount": 42000,
        "abstract": "We propose two novel model architectures for computing continuous vector representations of words from very large datasets (Continuous Bag-of-Words and Skip-gram).",
        "tldr": "Introduced Word2Vec embeddings for semantic dense representations of language.",
        "authors": [
            {"id": "a_mikolov", "name": "Tomas Mikolov"},
            {"id": "a_chen", "name": "Kai Chen"},
            {"id": "a_corrado", "name": "Greg Corrado"},
            {"id": "a_dean", "name": "Jeffrey Dean"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Word Embeddings"],
        "references": []
    },
    # 2. NLP Foundation Models
    {
        "id": "df2b0e26d0599ce3e70df8a9da02e51594e0e640",
        "title": "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
        "year": 2018,
        "venue": "NAACL",
        "citationCount": 98000,
        "abstract": "We introduce BERT, which stands for Bidirectional Encoder Representations from Transformers. BERT is designed to pretrain deep bidirectional representations from unlabeled text.",
        "tldr": "Introduces masked language modeling and bidirectional pre-training for NLP encoders.",
        "authors": [
            {"id": "a_devlin", "name": "Jacob Devlin"},
            {"id": "a_chang", "name": "Ming-Wei Chang"},
            {"id": "a_lee", "name": "Kenton Lee"},
            {"id": "a_toutanova", "name": "Kristina Toutanova"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Transformers", "Self-Supervised Learning"],
        "references": ["204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_elmo_peters", "p_mikolov_word2vec"]
    },
    {
        "id": "p_gpt3_brown",
        "title": "Language Models are Few-Shot Learners",
        "year": 2020,
        "venue": "NeurIPS",
        "citationCount": 38000,
        "abstract": "We demonstrate that scaling up language models greatly improves task-agnostic, few-shot performance, autoregressively training GPT-3 with 175 billion parameters.",
        "tldr": "Demonstrates few-shot in-context learning emergent capabilities in 175B parameter autoregressive Transformer (GPT-3).",
        "authors": [
            {"id": "a_brown", "name": "Tom B. Brown"},
            {"id": "a_mann", "name": "Benjamin Mann"},
            {"id": "a_radford", "name": "Alec Radford"},
            {"id": "a_amodei", "name": "Dario Amodei"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Transformers", "Large Language Models"],
        "references": ["204e3073870fae3d05bcbc2f6a8e263d9b72e776", "df2b0e26d0599ce3e70df8a9da02e51594e0e640", "p_radford_gpt2"]
    },
    {
        "id": "p_radford_gpt2",
        "title": "Language Models are Unsupervised Multitask Learners",
        "year": 2019,
        "venue": "OpenAI Technical Report",
        "citationCount": 16000,
        "abstract": "We show that language models can learn tasks without any explicit supervision when trained on a large dataset of WebText.",
        "tldr": "Presents GPT-2 demonstrating zero-shot task transfer from WebText pre-training.",
        "authors": [
            {"id": "a_radford", "name": "Alec Radford"},
            {"id": "a_wu", "name": "Jeffrey Wu"},
            {"id": "a_amodei", "name": "Dario Amodei"},
            {"id": "a_sutskever", "name": "Ilya Sutskever"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Transformers"],
        "references": ["204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    {
        "id": "p_lora_hu",
        "title": "LoRA: Low-Rank Adaptation of Large Language Models",
        "year": 2021,
        "venue": "ICLR",
        "citationCount": 12500,
        "abstract": "We propose Low-Rank Adaptation, or LoRA, which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture.",
        "tldr": "Introduces parameter-efficient fine-tuning via low-rank matrix decomposition for massive Transformer models.",
        "authors": [
            {"id": "a_hu", "name": "Edward J. Hu"},
            {"id": "a_shen", "name": "Yelong Shen"},
            {"id": "a_wallis", "name": "Phillip Wallis"},
            {"id": "a_allen_zhu", "name": "Zeyuan Allen-Zhu"},
            {"id": "a_li", "name": "Yuanzhi Li"},
            {"id": "a_wang", "name": "Shean Wang"},
            {"id": "a_chen", "name": "Lu Wang"},
            {"id": "a_chen_w", "name": "Weizhu Chen"}
        ],
        "fieldsOfStudy": ["Computer Science", "Parameter-Efficient Fine-Tuning", "Transformers", "Large Language Models"],
        "references": ["p_gpt3_brown", "204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_houlsby_adapters"]
    },
    {
        "id": "p_flash_attention",
        "title": "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
        "year": 2022,
        "venue": "NeurIPS",
        "citationCount": 5400,
        "abstract": "Transformers are slow and memory-hungry on long sequences. We propose FlashAttention, an IO-aware exact attention algorithm that uses tiling to reduce memory reads/writes between GPU SRAM and HBM.",
        "tldr": "IO-aware exact attention algorithm with GPU SRAM tiling achieving dramatic speedups and linear memory scaling.",
        "authors": [
            {"id": "a_dao", "name": "Tri Dao"},
            {"id": "a_fu", "name": "Daniel Y. Fu"},
            {"id": "a_saab", "name": "Khaled K. Saab"},
            {"id": "a_re", "name": "Christopher Ré"}
        ],
        "fieldsOfStudy": ["Computer Science", "Hardware Acceleration", "Attention Mechanism", "Transformers"],
        "references": ["204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_gpt3_brown"]
    },
    # 3. Graph Neural Networks
    {
        "id": "p_kipf_gcn",
        "title": "Semi-Supervised Classification with Graph Convolutional Networks",
        "year": 2017,
        "venue": "ICLR",
        "citationCount": 31000,
        "abstract": "We present a scalable approach for semi-supervised learning on graph-structured data based on an efficient localized first-order approximation of spectral graph convolutions.",
        "tldr": "Introduces Graph Convolutional Networks (GCN) via localized first-order spectral approximations.",
        "authors": [
            {"id": "a_kipf", "name": "Thomas N. Kipf"},
            {"id": "a_welling", "name": "Max Welling"}
        ],
        "fieldsOfStudy": ["Computer Science", "Graph Neural Networks", "Deep Learning", "Spectral Graph Theory"],
        "references": ["p_defferrard_chebnet", "p_perozzi_deepwalk"]
    },
    {
        "id": "p_hamilton_graphsage",
        "title": "Inductive Representation Learning on Large Graphs",
        "year": 2017,
        "venue": "NeurIPS",
        "citationCount": 18500,
        "abstract": "We present GraphSAGE, an inductive framework for generating node embeddings by sampling and aggregating features from a node's local neighborhood.",
        "tldr": "Introduces GraphSAGE for inductive node feature aggregation on evolving large graphs.",
        "authors": [
            {"id": "a_hamilton", "name": "William L. Hamilton"},
            {"id": "a_ying", "name": "Rex Ying"},
            {"id": "a_leskovec", "name": "Jure Leskovec"}
        ],
        "fieldsOfStudy": ["Computer Science", "Graph Neural Networks", "Inductive Learning"],
        "references": ["p_kipf_gcn", "p_grover_node2vec", "p_perozzi_deepwalk"]
    },
    {
        "id": "p_velickovic_gat",
        "title": "Graph Attention Networks",
        "year": 2018,
        "venue": "ICLR",
        "citationCount": 24000,
        "abstract": "We present Graph Attention Networks (GATs), novel neural network architectures that operate on graph-structured data, leveraging masked self-attentional layers to address the shortcomings of prior graph convolution methods.",
        "tldr": "Combines self-attention with graph convolutions to compute anisotropic attention weights across neighbor nodes.",
        "authors": [
            {"id": "a_velickovic", "name": "Petar Veličković"},
            {"id": "a_cucurull", "name": "Guillem Cucurull"},
            {"id": "a_casanova", "name": "Arantxa Casanova"},
            {"id": "a_romero", "name": "Adriana Romero"},
            {"id": "a_lio", "name": "Pietro Liò"},
            {"id": "a_bengio", "name": "Yoshua Bengio"}
        ],
        "fieldsOfStudy": ["Computer Science", "Graph Neural Networks", "Attention Mechanism", "Deep Learning"],
        "references": ["204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_kipf_gcn", "p_hamilton_graphsage", "p_bahdanau_2014"]
    },
    {
        "id": "p_dwivedi_benchmarking_gnns",
        "title": "Benchmarking Graph Neural Networks",
        "year": 2020,
        "venue": "JMLR",
        "citationCount": 2900,
        "abstract": "We establish a reproducible and standardized benchmarking suite for Graph Neural Networks across chemistry, social, and mathematical graph datasets.",
        "tldr": "Rigorous benchmarking platform demonstrating limitations and expressive power of GNN architectures.",
        "authors": [
            {"id": "a_dwivedi", "name": "Vijay Prakash Dwivedi"},
            {"id": "a_joshi", "name": "Chaitanya K. Joshi"},
            {"id": "a_laurent", "name": "Thomas Laurent"},
            {"id": "a_bresson", "name": "Xavier Bresson"}
        ],
        "fieldsOfStudy": ["Computer Science", "Graph Neural Networks", "Graph Representation"],
        "references": ["p_kipf_gcn", "p_velickovic_gat", "p_hamilton_graphsage"]
    },
    # 4. Computer Vision Foundations
    {
        "id": "p_he_resnet",
        "title": "Deep Residual Learning for Image Recognition",
        "year": 2016,
        "venue": "CVPR",
        "citationCount": 210000,
        "abstract": "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously.",
        "tldr": "Introduced skip connections / identity residual mappings enabling training of ultra-deep networks (ResNet-152).",
        "authors": [
            {"id": "a_he", "name": "Kaiming He"},
            {"id": "a_zhang", "name": "Xiangyu Zhang"},
            {"id": "a_ren", "name": "Shaoqing Ren"},
            {"id": "a_sun", "name": "Jian Sun"}
        ],
        "fieldsOfStudy": ["Computer Science", "Computer Vision", "Deep Learning", "Residual Learning"],
        "references": ["p_krizhevsky_alexnet", "p_simonyan_vgg"]
    },
    {
        "id": "p_krizhevsky_alexnet",
        "title": "ImageNet Classification with Deep Convolutional Neural Networks",
        "year": 2012,
        "venue": "NeurIPS",
        "citationCount": 140000,
        "abstract": "We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest.",
        "tldr": "Ignited modern deep learning revolution by winning ImageNet 2012 with GPU-accelerated CNN (AlexNet).",
        "authors": [
            {"id": "a_krizhevsky", "name": "Alex Krizhevsky"},
            {"id": "a_sutskever", "name": "Ilya Sutskever"},
            {"id": "a_hinton", "name": "Geoffrey E. Hinton"}
        ],
        "fieldsOfStudy": ["Computer Science", "Computer Vision", "Convolutional Networks"],
        "references": []
    },
    {
        "id": "p_dosovitskiy_vit",
        "title": "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
        "year": 2020,
        "venue": "ICLR",
        "citationCount": 42000,
        "abstract": "While the Transformer architecture has become the de-facto standard for NLP tasks, its applications to computer vision remain limited. We show that Vision Transformer (ViT) directly applied to patches of images performs remarkably well.",
        "tldr": "Replaces convolutional backbones with patch-based Vision Transformers (ViT) for image recognition.",
        "authors": [
            {"id": "a_dosovitskiy", "name": "Alexey Dosovitskiy"},
            {"id": "a_beyer", "name": "Lucas Beyer"},
            {"id": "a_kolesnikov", "name": "Alexander Kolesnikov"},
            {"id": "a_houlsby", "name": "Neil Houlsby"}
        ],
        "fieldsOfStudy": ["Computer Science", "Computer Vision", "Transformers", "Deep Learning"],
        "references": ["204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_he_resnet", "df2b0e26d0599ce3e70df8a9da02e51594e0e640"]
    },
    # 5. Generative Models & Diffusion
    {
        "id": "p_ho_ddpm",
        "title": "Denoising Diffusion Probabilistic Models",
        "year": 2020,
        "venue": "NeurIPS",
        "citationCount": 14500,
        "abstract": "We present high quality image synthesis results using diffusion probabilistic models, a class of latent variable models inspired by non-equilibrium thermodynamics.",
        "tldr": "Demonstrated that Denoising Diffusion Probabilistic Models (DDPM) achieve image synthesis quality surpassing GANs.",
        "authors": [
            {"id": "a_ho", "name": "Jonathan Ho"},
            {"id": "a_jain", "name": "Ajay Jain"},
            {"id": "a_abbeel", "name": "Pieter Abbeel"}
        ],
        "fieldsOfStudy": ["Computer Science", "Generative Models", "Diffusion Models", "Deep Learning"],
        "references": ["p_sohl_dickstein_diffusion", "p_song_score_sde", "p_he_resnet"]
    },
    {
        "id": "p_rombach_latent_diffusion",
        "title": "High-Resolution Image Synthesis with Latent Diffusion Models",
        "year": 2022,
        "venue": "CVPR",
        "citationCount": 18000,
        "abstract": "By decomposing the image formation process into a sequential application of denoising autoencoders, diffusion models achieve state-of-the-art synthesis results. We apply them in the latent space of pre-trained autoencoders (Stable Diffusion).",
        "tldr": "Introduced Latent Diffusion Models (Stable Diffusion) for compute-efficient high-resolution text-to-image synthesis.",
        "authors": [
            {"id": "a_rombach", "name": "Robin Rombach"},
            {"id": "a_blattmann", "name": "Andreas Blattmann"},
            {"id": "a_lorenz", "name": "Dominik Lorenz"},
            {"id": "a_esser", "name": "Patrick Esser"},
            {"id": "a_ommer", "name": "Björn Ommer"}
        ],
        "fieldsOfStudy": ["Computer Science", "Generative Models", "Diffusion Models", "Transformers", "Computer Vision"],
        "references": ["p_ho_ddpm", "204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_radford_clip"]
    },
    {
        "id": "p_radford_clip",
        "title": "Learning Transferable Visual Models From Natural Language Supervision",
        "year": 2021,
        "venue": "ICML",
        "citationCount": 26000,
        "abstract": "State-of-the-art computer vision systems are trained to predict a fixed set of predetermined categories. We demonstrate that predicting which caption goes with which image (CLIP) is an efficient way to learn SOTA representations.",
        "tldr": "Introduces CLIP: contrastive multimodal pre-training uniting visual and textual representations.",
        "authors": [
            {"id": "a_radford", "name": "Alec Radford"},
            {"id": "a_kim", "name": "Jong Wook Kim"},
            {"id": "a_hallacy", "name": "Chris Hallacy"},
            {"id": "a_sutskever", "name": "Ilya Sutskever"}
        ],
        "fieldsOfStudy": ["Computer Science", "Multimodal Learning", "Computer Vision", "Natural Language Processing", "Self-Supervised Learning"],
        "references": ["204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_dosovitskiy_vit", "p_he_resnet"]
    },
    # 6. Structural Biology & Scientific ML
    {
        "id": "p_jumper_alphafold2",
        "title": "Highly Accurate Protein Structure Prediction with AlphaFold",
        "year": 2021,
        "venue": "Nature",
        "citationCount": 29000,
        "abstract": "Proteins are essential to life, and understanding their structure can facilitate a mechanistic understanding of their function. We demonstrate AlphaFold2, an attention-based neural network system that predicts 3D protein structures with atomic accuracy.",
        "tldr": "Solves the 50-year protein folding challenge using Evoformer attention and structural graph representations.",
        "authors": [
            {"id": "a_jumper", "name": "John Jumper"},
            {"id": "a_evans", "name": "Richard Evans"},
            {"id": "a_pritzel", "name": "Alexander Pritzel"},
            {"id": "a_hassabis", "name": "Demis Hassabis"}
        ],
        "fieldsOfStudy": ["Structural Biology", "Bioinformatics", "Attention Mechanism", "Graph Neural Networks", "Deep Learning"],
        "references": ["204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_he_resnet", "p_kipf_gcn"]
    },
    {
        "id": "p_ingraham_generative_protein",
        "title": "Generative Models for Graph-Based Protein Design",
        "year": 2019,
        "venue": "NeurIPS",
        "citationCount": 1800,
        "abstract": "We present an autoregressive graph neural network for designing amino acid sequences that fold into targeted 3D structures.",
        "tldr": "Pioneered autoregressive GNN message-passing for inverse protein sequence design.",
        "authors": [
            {"id": "a_ingraham", "name": "John Ingraham"},
            {"id": "a_garg", "name": "Vikas Garg"},
            {"id": "a_barzilay", "name": "Regina Barzilay"},
            {"id": "a_jaakkola", "name": "Tommi Jaakkola"}
        ],
        "fieldsOfStudy": ["Structural Biology", "Bioinformatics", "Graph Neural Networks", "Generative Models"],
        "references": ["p_kipf_gcn", "p_velickovic_gat", "204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    # 7. LLMs, Reasoning & Alignment
    {
        "id": "p_radford_gpt2",
        "title": "Language Models are Unsupervised Multitask Learners",
        "year": 2019,
        "venue": "OpenAI Technical Report",
        "citationCount": 18500,
        "abstract": "We demonstrate that language models can learn NLP tasks without any explicit supervision when trained on a large dataset of diverse text (WebText).",
        "tldr": "Showcased zero-shot task transfer in scaled autoregressive language models (GPT-2).",
        "authors": [
            {"id": "a_radford", "name": "Alec Radford"},
            {"id": "a_wu", "name": "Jeffrey Wu"},
            {"id": "a_child", "name": "Rewon Child"},
            {"id": "a_luan", "name": "David Luan"},
            {"id": "a_amodei", "name": "Dario Amodei"},
            {"id": "a_sutskever", "name": "Ilya Sutskever"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Large Language Models", "Deep Learning"],
        "references": ["204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_devlin_bert"]
    },
    {
        "id": "p_brown_gpt3",
        "title": "Language Models are Few-Shot Learners",
        "year": 2020,
        "venue": "NeurIPS",
        "citationCount": 38000,
        "abstract": "We train GPT-3, a 175B-parameter autoregressive language model, and test its performance in few-shot, one-shot, and zero-shot settings without gradient updates.",
        "tldr": "Demonstrated that scaling parameters to 175B enables in-context few-shot learning across diverse reasoning tasks.",
        "authors": [
            {"id": "a_brown", "name": "Tom B. Brown"},
            {"id": "a_mann", "name": "Benjamin Mann"},
            {"id": "a_ryder", "name": "Nick Ryder"},
            {"id": "a_subbiah", "name": "Melanie Subbiah"},
            {"id": "a_kaplan", "name": "Jared Kaplan"},
            {"id": "a_amodei", "name": "Dario Amodei"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Large Language Models", "Deep Learning"],
        "references": ["204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_radford_gpt2"]
    },
    {
        "id": "p_ouyang_instructgpt",
        "title": "Training language models to follow instructions with human feedback",
        "year": 2022,
        "venue": "NeurIPS",
        "citationCount": 16000,
        "abstract": "Making language models bigger does not inherently make them better at following a user's intent. We align language models with user intent using reinforcement learning from human feedback (RLHF).",
        "tldr": "Introduced RLHF for aligning large language models with human preferences (InstructGPT & ChatGPT foundations).",
        "authors": [
            {"id": "a_ouyang", "name": "Long Ouyang"},
            {"id": "a_wu", "name": "Jeffrey Wu"},
            {"id": "a_jiang", "name": "Xu Jiang"},
            {"id": "a_almeida", "name": "Diogo Almeida"},
            {"id": "a_wainwright", "name": "Carroll L. Wainwright"},
            {"id": "a_mishkin", "name": "Pamela Mishkin"},
            {"id": "a_zhang", "name": "Chong Zhang"},
            {"id": "a_agarwal", "name": "Sandhini Agarwal"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Reinforcement Learning", "Large Language Models"],
        "references": ["p_brown_gpt3", "p_schulman_ppo", "204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    {
        "id": "p_wei_cot",
        "title": "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
        "year": 2022,
        "venue": "NeurIPS",
        "citationCount": 12500,
        "abstract": "We explore how generating a chain of thought—a series of intermediate reasoning steps—significantly improves the ability of large language models to perform complex reasoning.",
        "tldr": "Pioneered Chain-of-Thought prompting to drastically boost multi-step symbolic and mathematical reasoning in LLMs.",
        "authors": [
            {"id": "a_wei", "name": "Jason Wei"},
            {"id": "a_wang", "name": "Xuezhi Wang"},
            {"id": "a_schuurmans", "name": "Dale Schuurmans"},
            {"id": "a_bosma", "name": "Maarten Bosma"},
            {"id": "a_brian", "name": "Brian Ichter"},
            {"id": "a_xia", "name": "Fei Xia"},
            {"id": "a_chi", "name": "Ed H. Chi"},
            {"id": "a_le", "name": "Quoc V. Le"},
            {"id": "a_zhou", "name": "Denny Zhou"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Large Language Models", "Attention Mechanism"],
        "references": ["p_brown_gpt3", "204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    {
        "id": "p_touvron_llama",
        "title": "LLaMA: Open and Efficient Foundation Language Models",
        "year": 2023,
        "venue": "arXiv",
        "citationCount": 19500,
        "abstract": "We introduce LLaMA, a collection of foundation language models ranging from 7B to 65B parameters. LLaMA-13B outperforms GPT-3 on most benchmarks while being 10x smaller.",
        "tldr": "Open-weights foundation models proving that smaller models trained on more tokens achieve superior inference efficiency.",
        "authors": [
            {"id": "a_touvron", "name": "Hugo Touvron"},
            {"id": "a_lavril", "name": "Thibaut Lavril"},
            {"id": "a_izacard", "name": "Gautier Izacard"},
            {"id": "a_martinet", "name": "Xavier Martinet"},
            {"id": "a_lachaux", "name": "Marie-Anne Lachaux"},
            {"id": "a_lacroix", "name": "Timothée Lacroix"},
            {"id": "a_roziere", "name": "Baptiste Rozière"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Large Language Models"],
        "references": ["204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_brown_gpt3", "p_dao_flashattention"]
    },
    {
        "id": "p_jiang_mistral",
        "title": "Mistral 7B",
        "year": 2023,
        "venue": "arXiv",
        "citationCount": 6500,
        "abstract": "We introduce Mistral 7B, an open 7.3B parameter language model using grouped-query attention and sliding window attention for fast inference and long sequences.",
        "tldr": "Introduced sliding window attention and grouped query attention in a 7B model outperforming LLaMA 13B.",
        "authors": [
            {"id": "a_jiang_albert", "name": "Albert Q. Jiang"},
            {"id": "a_sablaya", "name": "Alexandre Sablayrolles"},
            {"id": "a_mensch", "name": "Arthur Mensch"},
            {"id": "a_blanchet", "name": "Chris Bamford"},
            {"id": "a_chaplot", "name": "Devendra Singh Chaplot"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Large Language Models", "Attention Mechanism"],
        "references": ["p_touvron_llama", "p_dao_flashattention", "204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    {
        "id": "p_jiang_mixtral",
        "title": "Mixtral of Experts",
        "year": 2024,
        "venue": "arXiv",
        "citationCount": 4200,
        "abstract": "We present Mixtral 8x7B, a Sparse Mixture of Experts (SMoE) language model that routes each token to 2 of 8 experts per layer, achieving 13B active parameter inference speed with 47B capacity.",
        "tldr": "Popularized sparse Mixture-of-Experts (MoE) architectures in open frontier LLMs.",
        "authors": [
            {"id": "a_jiang_albert", "name": "Albert Q. Jiang"},
            {"id": "a_sablaya", "name": "Alexandre Sablayrolles"},
            {"id": "a_antoine", "name": "Antoine Roux"},
            {"id": "a_mensch", "name": "Arthur Mensch"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Large Language Models", "Deep Learning"],
        "references": ["p_jiang_mistral", "p_touvron_llama", "204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    {
        "id": "p_deepseek_v3",
        "title": "DeepSeek-V3 Technical Report",
        "year": 2024,
        "venue": "arXiv",
        "citationCount": 3100,
        "abstract": "We present DeepSeek-V3, a strong Mixture-of-Experts language model with 671B total parameters and 37B activated per token, utilizing Multi-Head Latent Attention (MLA) and DeepSeekMoE.",
        "tldr": "Introduced Multi-Head Latent Attention (MLA) and ultra-efficient FP8 MoE training on frontier clusters.",
        "authors": [
            {"id": "a_liang", "name": "Wenfeng Liang"},
            {"id": "a_liu", "name": "Aixin Liu"},
            {"id": "a_zhao", "name": "Bing Zhao"},
            {"id": "a_chen_ds", "name": "Deyu Chen"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Large Language Models", "Attention Mechanism"],
        "references": ["p_jiang_mixtral", "p_dao_flashattention", "204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    {
        "id": "p_deepseek_r1",
        "title": "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
        "year": 2025,
        "venue": "arXiv",
        "citationCount": 2400,
        "abstract": "We present DeepSeek-R1-Zero, a model trained via large-scale reinforcement learning without supervised fine-tuning, demonstrating emergent self-reflection and multi-step reasoning capabilities.",
        "tldr": "Demonstrated that pure RL with rule-based reward verification elicits advanced self-correction and reasoning in LLMs.",
        "authors": [
            {"id": "a_liang", "name": "Wenfeng Liang"},
            {"id": "a_liu", "name": "Aixin Liu"},
            {"id": "a_shao", "name": "Zhihong Shao"},
            {"id": "a_wang_ds", "name": "Peiyi Wang"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Reinforcement Learning", "Large Language Models"],
        "references": ["p_deepseek_v3", "p_wei_cot", "p_ouyang_instructgpt", "p_schulman_ppo"]
    },
    {
        "id": "p_rafailov_dpo",
        "title": "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
        "year": 2023,
        "venue": "NeurIPS",
        "citationCount": 5400,
        "abstract": "We propose Direct Preference Optimization (DPO), which derives an exact closed-form mapping between human preference probabilities and the optimal language model policy without fitting an explicit reward model.",
        "tldr": "Eliminated the need for complex PPO reward models in RLHF by optimizing preference loss directly.",
        "authors": [
            {"id": "a_rafailov", "name": "Rafael Rafailov"},
            {"id": "a_sharma", "name": "Archit Sharma"},
            {"id": "a_mitchell", "name": "Eric Mitchell"},
            {"id": "a_ermon", "name": "Stefano Ermon"},
            {"id": "a_manning", "name": "Christopher D. Manning"},
            {"id": "a_finn", "name": "Chelsea Finn"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Reinforcement Learning", "Large Language Models"],
        "references": ["p_ouyang_instructgpt", "p_schulman_ppo", "p_brown_gpt3"]
    },
    # 8. Advanced Diffusion & Generative Vision
    {
        "id": "p_rombach_ldm",
        "title": "High-Resolution Image Synthesis with Latent Diffusion Models",
        "year": 2022,
        "venue": "CVPR",
        "citationCount": 18000,
        "abstract": "By applying diffusion models in the latent space of powerful pretrained autoencoders, we achieve a new state of the art for image synthesis while significantly reducing computational requirements (Stable Diffusion).",
        "tldr": "Introduced Latent Diffusion Models (LDM / Stable Diffusion) for high-resolution text-to-image synthesis.",
        "authors": [
            {"id": "a_rombach", "name": "Robin Rombach"},
            {"id": "a_blattmann", "name": "Andreas Blattmann"},
            {"id": "a_lorenz", "name": "Dominik Lorenz"},
            {"id": "a_esser", "name": "Patrick Esser"},
            {"id": "a_ommer", "name": "Björn Ommer"}
        ],
        "fieldsOfStudy": ["Computer Science", "Computer Vision", "Generative Models", "Diffusion Models", "Attention Mechanism"],
        "references": ["p_ho_diffusion", "p_radford_clip", "p_ronneberger_unet", "204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    {
        "id": "p_peebles_dit",
        "title": "Scalable Diffusion Models with Transformers",
        "year": 2023,
        "venue": "ICCV",
        "citationCount": 3800,
        "abstract": "We explore a new class of diffusion models based on the Transformer architecture (DiT), replacing the commonly-used U-Net backbone with a Vision Transformer operating on latent patches.",
        "tldr": "Replaced U-Net with Transformers in diffusion models (DiT), serving as the core architecture of modern video generators (Sora).",
        "authors": [
            {"id": "a_peebles", "name": "William Peebles"},
            {"id": "a_xie", "name": "Saining Xie"}
        ],
        "fieldsOfStudy": ["Computer Science", "Computer Vision", "Diffusion Models", "Attention Mechanism", "Generative Models"],
        "references": ["p_rombach_ldm", "p_dosovitskiy_vit", "p_ho_diffusion", "204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    {
        "id": "p_zhang_controlnet",
        "title": "Adding Conditional Control to Text-to-Image Diffusion Models",
        "year": 2023,
        "venue": "ICCV",
        "citationCount": 5900,
        "abstract": "We present ControlNet, an end-to-end neural network architecture that learns conditional controls (edge maps, depth, segmentation, human poses) for large pretrained text-to-image diffusion models.",
        "tldr": "Introduced zero-convolution locked-copy network routing for precise structural conditioning in diffusion.",
        "authors": [
            {"id": "a_zhang_lvmin", "name": "Lvmin Zhang"},
            {"id": "a_rao", "name": "Anyi Rao"},
            {"id": "a_agrawala", "name": "Maneesh Agrawala"}
        ],
        "fieldsOfStudy": ["Computer Science", "Computer Vision", "Diffusion Models", "Generative Models"],
        "references": ["p_rombach_ldm", "p_ho_diffusion", "p_ronneberger_unet"]
    },
    # 9. Spatial Computing & 3D Representations
    {
        "id": "p_mildenhall_nerf",
        "title": "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis",
        "year": 2020,
        "venue": "ECCV",
        "citationCount": 14000,
        "abstract": "We present a method that achieves state-of-the-art results for synthesizing novel views of complex scenes by optimizing an underlying continuous volumetric scene function using a sparse set of input views.",
        "tldr": "Introduced Neural Radiance Fields (NeRF) mapping 5D spatial coordinates $(x,y,z,\\theta,\\phi)$ to volume density and RGB color via continuous MLPs.",
        "authors": [
            {"id": "a_mildenhall", "name": "Ben Mildenhall"},
            {"id": "a_hedman", "name": "Peter Hedman"},
            {"id": "a_nguyen", "name": "Pratul P. Srinivasan"},
            {"id": "a_tancik", "name": "Matthew Tancik"},
            {"id": "a_barron", "name": "Jonathan T. Barron"},
            {"id": "a_ramamoorthi", "name": "Ravi Ramamoorthi"},
            {"id": "a_ng", "name": "Ren Ng"}
        ],
        "fieldsOfStudy": ["Computer Science", "Computer Vision", "3D Reconstruction", "Deep Learning"],
        "references": ["p_he_resnet"]
    },
    {
        "id": "p_kerbl_3dgs",
        "title": "3D Gaussian Splatting for Real-Time Radiance Field Rendering",
        "year": 2023,
        "venue": "SIGGRAPH",
        "citationCount": 5100,
        "abstract": "Radiance fields methods have recently revolutionized novel-view synthesis. We introduce 3D Gaussian Splatting, combining anisotropic 3D Gaussians with a fast tile-based rasterizer for real-time (100+ fps) high-fidelity rendering.",
        "tldr": "Replaced neural implicit ray marching with differentiable 3D Gaussian Splatting for real-time 100+ FPS novel view rendering.",
        "authors": [
            {"id": "a_kerbl", "name": "Bernhard Kerbl"},
            {"id": "a_kopanas", "name": "Georgios Kopanas"},
            {"id": "a_leimkuhler", "name": "Thomas Leimkühler"},
            {"id": "a_drettakis", "name": "George Drettakis"}
        ],
        "fieldsOfStudy": ["Computer Science", "Computer Vision", "3D Reconstruction", "Computer Graphics"],
        "references": ["p_mildenhall_nerf"]
    },
    # 10. Vision Foundation Models
    {
        "id": "p_kirillov_sam",
        "title": "Segment Anything",
        "year": 2023,
        "venue": "ICCV",
        "citationCount": 8500,
        "abstract": "We introduce the Segment Anything (SAM) project: a new task, model, and dataset (SA-1B) for image segmentation, enabling zero-shot generalization across diverse promptable visual modalities.",
        "tldr": "Built the first promptable vision foundation model for zero-shot image segmentation across arbitrary prompts.",
        "authors": [
            {"id": "a_kirillov", "name": "Alexander Kirillov"},
            {"id": "a_mintun", "name": "Eric Mintun"},
            {"id": "a_ravi", "name": "Nikhila Ravi"},
            {"id": "a_mao", "name": "Hanzi Mao"},
            {"id": "a_dollar", "name": "Piotr Dollár"},
            {"id": "a_girshick", "name": "Ross Girshick"}
        ],
        "fieldsOfStudy": ["Computer Science", "Computer Vision", "Self-Supervised Learning", "Attention Mechanism"],
        "references": ["p_dosovitskiy_vit", "p_he_mae", "204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_radford_clip"]
    },
    {
        "id": "p_he_mae",
        "title": "Masked Autoencoders Are Scalable Vision Learners",
        "year": 2022,
        "venue": "CVPR",
        "citationCount": 11500,
        "abstract": "We show that masked autoencoders (MAE) are scalable self-supervised learners for computer vision. We mask random patches of the input image and reconstruct the missing pixels.",
        "tldr": "Demonstrated that masking 75% of visual patches enables highly effective self-supervised visual representation learning with Vision Transformers.",
        "authors": [
            {"id": "a_he", "name": "Kaiming He"},
            {"id": "a_chen_xinlei", "name": "Xinlei Chen"},
            {"id": "a_xie_saining", "name": "Saining Xie"},
            {"id": "a_yang", "name": "Haoqi Fan"},
            {"id": "a_dollar", "name": "Piotr Dollár"},
            {"id": "a_girshick", "name": "Ross Girshick"}
        ],
        "fieldsOfStudy": ["Computer Science", "Computer Vision", "Self-Supervised Learning", "Attention Mechanism"],
        "references": ["p_dosovitskiy_vit", "p_devlin_bert", "p_he_resnet", "204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    {
        "id": "p_liu_swin",
        "title": "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows",
        "year": 2021,
        "venue": "ICCV",
        "citationCount": 18000,
        "abstract": "This paper presents a new vision Transformer, called Swin Transformer, that capably serves as a general-purpose backbone for computer vision with linear computational complexity relative to image size.",
        "tldr": "Introduced shifted window self-attention for linear complexity hierarchical Vision Transformers.",
        "authors": [
            {"id": "a_liu_ze", "name": "Ze Liu"},
            {"id": "a_lin_yutong", "name": "Yutong Lin"},
            {"id": "a_cao_yue", "name": "Yue Cao"},
            {"id": "a_hu_han", "name": "Han Hu"},
            {"id": "a_wei_yixuan", "name": "Yixuan Wei"},
            {"id": "a_zhang_zheng", "name": "Zheng Zhang"},
            {"id": "a_lin_stephen", "name": "Stephen Lin"},
            {"id": "a_guo_baining", "name": "Baining Guo"}
        ],
        "fieldsOfStudy": ["Computer Science", "Computer Vision", "Attention Mechanism", "Deep Learning"],
        "references": ["p_dosovitskiy_vit", "p_he_resnet", "204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    # 11. Efficient Compute & State Space Models
    {
        "id": "p_gu_mamba",
        "title": "Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
        "year": 2023,
        "venue": "arXiv",
        "citationCount": 3900,
        "abstract": "We propose Mamba, a selective structured state space model (SSM) that achieves linear-time scaling in sequence length with hardware-aware parallel scans, matching Transformer performance.",
        "tldr": "Introduced selective state space models (SSMs) achieving 5x higher throughput and linear scaling over Transformers.",
        "authors": [
            {"id": "a_gu_albert", "name": "Albert Gu"},
            {"id": "a_dao_tri", "name": "Tri Dao"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "State Space Models", "Deep Learning"],
        "references": ["p_dao_flashattention", "204e3073870fae3d05bcbc2f6a8e263d9b72e776", "p_hochreiter_lstm"]
    },
    {
        "id": "p_dettmers_qlora",
        "title": "QLoRA: Efficient Finetuning of Quantized LLMs",
        "year": 2023,
        "venue": "NeurIPS",
        "citationCount": 6800,
        "abstract": "We present QLoRA, an efficient finetuning approach that reduces memory usage enough to finetune a 65B parameter model on a single 48GB GPU using 4-bit NormalFloat (NF4) and Double Quantization.",
        "tldr": "Pioneered 4-bit NormalFloat quantization and paged optimizers for accessible parameter-efficient LLM fine-tuning.",
        "authors": [
            {"id": "a_dettmers", "name": "Tim Dettmers"},
            {"id": "a_pagnoni", "name": "Artidoro Pagnoni"},
            {"id": "a_holtzman", "name": "Ari Holtzman"},
            {"id": "a_zettlemoyer", "name": "Luke Zettlemoyer"}
        ],
        "fieldsOfStudy": ["Computer Science", "Natural Language Processing", "Quantization", "Large Language Models"],
        "references": ["p_hu_lora", "p_touvron_llama", "204e3073870fae3d05bcbc2f6a8e263d9b72e776"]
    },
    # 12. Reinforcement Learning Foundations
    {
        "id": "p_mnih_dqn",
        "title": "Human-level control through deep reinforcement learning",
        "year": 2015,
        "venue": "Nature",
        "citationCount": 31000,
        "abstract": "We develop a novel agent, a deep Q-network (DQN), that was able to master a diverse range of Atari 2600 games with human-level performance using raw pixel inputs and experience replay.",
        "tldr": "Pioneered Deep Q-Networks (DQN) with experience replay, kicking off modern deep reinforcement learning.",
        "authors": [
            {"id": "a_mnih", "name": "Volodymyr Mnih"},
            {"id": "a_kavukcuoglu", "name": "Koray Kavukcuoglu"},
            {"id": "a_silver", "name": "David Silver"},
            {"id": "a_rusu", "name": "Andrei A. Rusu"},
            {"id": "a_veness", "name": "Joel Veness"},
            {"id": "a_hassabis", "name": "Demis Hassabis"}
        ],
        "fieldsOfStudy": ["Computer Science", "Reinforcement Learning", "Deep Learning"],
        "references": ["p_lecun_cnn"]
    },
    {
        "id": "p_schulman_ppo",
        "title": "Proximal Policy Optimization Algorithms",
        "year": 2017,
        "venue": "arXiv",
        "citationCount": 24000,
        "abstract": "We propose Proximal Policy Optimization (PPO), a class of reinforcement learning algorithms that optimize a clipped surrogate objective function using multiple epochs of stochastic gradient ascent.",
        "tldr": "Standard reinforcement learning algorithm for policy gradient optimization and LLM alignment (RLHF).",
        "authors": [
            {"id": "a_schulman", "name": "John Schulman"},
            {"id": "a_wolski", "name": "Filip Wolski"},
            {"id": "a_dhariwal", "name": "Prafulla Dhariwal"},
            {"id": "a_radford", "name": "Alec Radford"},
            {"id": "a_klimov", "name": "Oleg Klimov"}
        ],
        "fieldsOfStudy": ["Computer Science", "Reinforcement Learning", "Deep Learning"],
        "references": ["p_mnih_dqn"]
    },
    {
        "id": "p_silver_alphago",
        "title": "Mastering the game of Go with deep neural networks and tree search",
        "year": 2016,
        "venue": "Nature",
        "citationCount": 17000,
        "abstract": "We introduce AlphaGo, combining Monte Carlo tree search with deep policy and value neural networks trained through supervised learning and reinforcement learning from self-play.",
        "tldr": "Historic breakthrough defeating human world champions in Go through deep RL and Monte Carlo Tree Search.",
        "authors": [
            {"id": "a_silver", "name": "David Silver"},
            {"id": "a_huang", "name": "Aja Huang"},
            {"id": "a_maddison", "name": "Chris J. Maddison"},
            {"id": "a_guez", "name": "Arthur Guez"},
            {"id": "a_sifre", "name": "Laurent Sifre"},
            {"id": "a_hassabis", "name": "Demis Hassabis"}
        ],
        "fieldsOfStudy": ["Computer Science", "Reinforcement Learning", "Artificial Intelligence", "Deep Learning"],
        "references": ["p_mnih_dqn", "p_lecun_cnn", "p_he_resnet"]
    }
]



def load_seed_data():
    logger.info("Initializing Schema before seeding...")
    init_schema()
    
    logger.info(f"Starting seed data load: {len(CURATED_PAPERS)} landmark papers...")
    result = graph_service.upsert_papers_batch(CURATED_PAPERS)
    logger.info(f"Seeding completed successfully! Graph changes: {result}")


if __name__ == "__main__":
    load_seed_data()
