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
