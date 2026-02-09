import numpy as np
import matplotlib.pyplot as plt

# generate some data
N = 1000000

# recall that we're modeling E[y|x] = lambda = exp(w*x) = mu
w = 0.35
X = np.random.rand(N, 1) * 2  # 1 Feature, scaled up for faster ex
mu = np.exp(w*X[:, 0])
y = np.random.poisson(mu)     # need to condition y on x

# check shapes
print(f"X has shape {X.shape}")
print(f"y has shape {y.shape}")

# link
def link(z):
	return np.exp(z)
	
# loss 
def compute_loss(y, z):
	return np.mean(link(z) - y*z)

# hyperparams	
lr = .25
epochs = 15
loss_history = []
weights = []

# start far away
w = -2
loss_history.append(compute_loss(y, w * X[:, 0]))
weights.append(w)

# training loop
for epoch in range(epochs):
	z = w * X[:, 0]
	mu = link(z)
	grad = np.mean(X[:, 0] * (mu - y))
	
	# avoid off by one error, update w, then compute the loss w/new w
	w -= lr * grad	
	loss = compute_loss(y, w*X[:,0])
	loss_history.append(loss)
	weights.append(w)

# computing the loss curve with all possible weights in a certain range
w_values = np.linspace(-5, 5, 100)
loss_surface = [
	compute_loss(y, w_val * X[:, 0]) 
	for w_val in w_values
]

plt.figure(figsize=(10, 6))
plt.plot(w_values, loss_surface, lw=4, label='Cross-Entropy Loss Surface')

# Draw dotted lines from parameter updates to loss values
for w_val, loss_val in zip(weights, loss_history):
    plt.plot([w_val, w_val], [0, loss_val], 'ok--', linewidth=1.1)

plt.scatter(
	weights, 
	[0]*len(weights), 
	color='red', 
	s=50, 
	label='Parameter Values', 
	zorder=10
)

plt.xlabel('Parameter Value (w)', fontsize=18)
plt.ylabel('Poisson NLL Loss', fontsize=18)
plt.ylim([0,4])
plt.xlim([-2.5, 2.5])
plt.title('Gradient Descent Updates on Poisson NLL Loss Surface')
plt.legend(fontsize=12)

print(f"Final weight is {w} vs. actual = 0.35")