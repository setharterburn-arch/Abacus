from manim import *

class Grade7RatiosMedium3(Scene):
    def construct(self):
        equation = MathTex(r'\text{Unit Rate} = \frac{150 \text{ miles}}{3 \text{ hours}}', color=WHITE).scale(1.0)
        self.play(Write(equation))
        self.wait(1)
        result = MathTex(r'= 50 \text{ miles/hour}', color=GREEN).next_to(equation, DOWN, buff=0.5).scale(1.0)
        self.play(Write(result))
        self.wait(2)
        self.play(FadeOut(equation, result))
