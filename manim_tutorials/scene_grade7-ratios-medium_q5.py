from manim import *

class Grade7RatiosMedium5(Scene):
    def construct(self):
        cost_one = MathTex(r'\frac{$2.50}{5} = $0.50', color=WHITE).scale(1.0)
        self.play(Write(cost_one))
        self.wait(1)

        cost_eight = MathTex(r'8 \times $0.50 = $4.00', color=GREEN).next_to(cost_one, DOWN, buff=0.5).scale(1.0)
        self.play(Write(cost_eight))
        self.wait(2)

        self.play(FadeOut(cost_one, cost_eight))
