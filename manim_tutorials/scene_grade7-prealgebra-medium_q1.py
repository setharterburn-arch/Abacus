from manim import *

class Grade7PrealgebraMedium(Scene):
    def construct(self):
        equation = MathTex(
            "12 + 3 \times (8 - 5) &= 12 + 3 \times 3 \\",
            "&= 12 + 9 \\",
            "&= 21"
        )

        self.play(Write(equation[0]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[0].copy(), equation[1]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[1].copy(), equation[2]))
        self.wait(2)
