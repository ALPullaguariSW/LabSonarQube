import matplotlib.pyplot as plt
import numpy as np
import os

def generate_lab3_comparison_plot(output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Data from notebook analysis
    metrics = ['Accuracy', 'Precision', 'F1-Score']
    baseline = [68.25, 47.87, 47.43]
    optimized = [80.63, 80.67, 78.34]

    x = np.arange(len(metrics))
    width = 0.35

    fig, ax = plt.subplots(figsize=(10, 6))
    rects1 = ax.bar(x - width/2, baseline, width, label='Baseline (MIN=3)', color='#ff9999')
    rects2 = ax.bar(x + width/2, optimized, width, label='Optimized (MIN=10)', color='#66b3ff')

    ax.set_ylabel('Score (%)')
    ax.set_title('Model Performance Comparison: Baseline vs Optimized')
    ax.set_xticks(x)
    ax.set_xticklabels(metrics)
    ax.legend()

    ax.bar_label(rects1, padding=3, fmt='%.2f%%')
    ax.bar_label(rects2, padding=3, fmt='%.2f%%')

    fig.tight_layout()
    
    output_path = os.path.join(output_dir, 'lab3_comparison_plot.png')
    plt.savefig(output_path, dpi=300)
    print(f"Saved {output_path}")

if __name__ == "__main__":
    output_dir = r"c:\Users\apullaguari\Downloads\plantilla_informes_espe_v2\images"
    generate_lab3_comparison_plot(output_dir)
