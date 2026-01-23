from manim import *

class Grade7RatiosMedium(Scene):
    def construct(self):
        ratio_text = MathTex(r'\frac{3}{5} = \frac{12}{x}', color=WHITE).scale(1.2)
        self.play(Write(ratio_text))
        self.wait(1)

        cross_multiply_text = MathTex(r'3x = 60', color=YELLOW).next_to(ratio_text, DOWN, buff=0.5).scale(1.2)
        self.play(Write(cross_multiply_text))
        self.wait(1)

        x_value_text = MathTex(r'x = 20', color=GREEN).next_to(cross_multiply_text, DOWN, buff=0.5).scale(1.2)
        self.play(Write(x_value_text))
        self.wait(2)

        self.play(FadeOut(ratio_text, cross_multiply_text, x_value_text))
